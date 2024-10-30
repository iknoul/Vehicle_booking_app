const minioClient = require('../../../../config/minioClient'); // Import MinIO client
const userRepository = require('../repositories/userRepositories'); // Repository layer
const TempPeriodRepository = require('../../vehicle/repositories/tempPeriodRepository');
const withTransaction = require('../../../helpers/trasnsactionManger');
const PeriodRepository = require('../../vehicle/repositories/periodRepo');
const { v4: uuidv4 } = require('uuid'); // Use uuid for unique file names
const bcrypt = require('bcrypt');
const otpService = require('./../../../services/otpService')
const jwt = require('./../../../services/jwt-servise')
const {fetchPinCodeData} = require('../../../../utils/fetchPinCodeData')
const paymentService = require('../../../services/paymentService');
const calculateAmount = require('../../../helpers/calculateAmountPerPeriod');
require('dotenv').config({ path: './../.env' });

const bucketName = 'user-bucket'; // MinIO bucket name

// Get all Users
const getAllUsers = async () => {
  // console.log('Fetching Users with filters:', filters);
  const users = await userRepository.findAllUsers();
  console.log(users[0], "Fetched Users with models");
  return users;
};

// Get a User by ID
const getUserById = async (id) => {
  return await userRepository.findUserById(id);
};

// Create a new User (including image upload to MinIO)
// Create a new User (including image upload to MinIO)
const createUser = async ({ name, email, mobile, password, profilePic }) => {
  try {
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
    }

    console.log('Received profilePic:', profilePic);

    // Resolve the Promise if profilePic is a Promise
    if (profilePic instanceof Promise) {
      profilePic = await profilePic;
    }

    // Upload the profile picture to MinIO if it's provided
    let imageUrl = null;
    if (profilePic && typeof profilePic.createReadStream === 'function') {
      console.log('Uploading image to MinIO...');

      // Generate a unique name for the image
      const imageName = uuidv4() + '.' + profilePic.filename.split('.').pop(); // Use the original file extension
      const imageStream = profilePic.createReadStream();

      // Upload the image stream to MinIO
      try {
        await minioClient.putObject(bucketName, imageName, imageStream);
        imageUrl = `${minioClient.protocol}//${process.env.MINIO_END_POINT}:${process.env.MINIO_PORT}/${bucketName}/${imageName}`;
        console.log('Image successfully uploaded to MinIO:', imageUrl);
      } catch (uploadError) {
        console.error('Error uploading image to MinIO:', uploadError);
        throw new Error('Failed to upload image');
      }
    } else {
      console.log('ProfilePic is not a valid file stream.');
    }

    // Hash the password before saving to the database
    const salt = await bcrypt.genSalt(10); // Adjust salt rounds as necessary
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save User to the database
    const newUser = await userRepository.createUser({
      name,
      email,
      mobile,
      password: hashedPassword,
      profilePic: imageUrl, // Save the image URL (if uploaded)
    });

    console.log('New user created successfully:', newUser);
    return newUser;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.log('Error: User already exists');
      throw new Error('User Already Exists');
    }
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};

const updateUser = async (id, updatedUserData) => {

  try {
    // Destructure properties only if they exist
    const { image: profilePicPromise, password } = updatedUserData;
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
    }

   
    let profilePic = undefined
    // Resolve the Promise if profilePic is a Promise
    if (profilePicPromise instanceof Promise) {
      profilePic = await profilePicPromise;
    }

    // Upload the profile picture to MinIO if it's provided
    let imageUrl = null;
    if (profilePic && typeof profilePic.createReadStream === 'function') {
      console.log('Uploading image to MinIO...');

      // Generate a unique name for the image
      const imageName = uuidv4() + '.' + profilePic.filename.split('.').pop(); // Use the original file extension
      const imageStream = profilePic.createReadStream();

      // Upload the image stream to MinIO
      try {
        await minioClient.putObject(bucketName, imageName, imageStream);
        imageUrl = `${minioClient.protocol}//${process.env.MINIO_END_POINT}:${process.env.MINIO_PORT}/${bucketName}/${imageName}`;
        updatedUserData.profilePic = imageUrl
        console.log('Image successfully uploaded to MinIO:', imageUrl);
      } catch (uploadError) {
        console.error('Error uploading image to MinIO:', uploadError);
        throw new Error('Failed to upload image');
      }
    } else {
      console.log('ProfilePic is not a valid file stream.');
    }

    if (password) {
      const salt = await bcrypt.genSalt(10); // Adjust salt rounds as necessary
      updatedUserData.password = await bcrypt.hash(password, salt);
    }

    // Call the repository method to update the User in the database
    console.log(updatedUserData, "here the updatedUserData")
    await userRepository.updateUser(id, updatedUserData);
    return {success:true, message: "suucesfully updated user profile"};
  } catch (error) {
    console.error('Error updating User:', error);
    throw new Error('Failed to update User');
  }
};
const sentOtp = async(mobile) =>{
  console.log(mobile, 'here ssss')
  try {
		const otp = otpService.generateOTP(mobile);
		console.log(otp, "thid is otp",mobile)
		// await twilio.sendSms(mobile, otp)
		return {success: true, message:"Otp send Succesfully"}
	} catch (error) {
    	throw new Error('Error in sending OTP')
  }
}

const verifyOtp = async(mobile, otp, userId) =>{
  try {
		console.log(mobile, otp, 'here the data')
		otpService.verifyOTP(mobile, otp);
    	const loginToken = jwt.createToken({ mobile, stage:'accessToChangePassword', userId})
		console.log(loginToken, 'here the login token')
		return {success: true, message:"Otp send Succesfully", token: loginToken}
	} catch (error) {
		console.log(error)
		throw new Error(error)
    // throw error
  }
}
// Delete a User by ID
const deleteUser = async (id) => {
  const isDeleted = await userRepository.deleteUser(id);
  if (isDeleted) {
    return { success: true, message: 'User deleted successfully' };
  } else {
    throw new Error('User not found');
  }
};

//Fetch addrss details from pinCode
const fetchAdress = async(pinCode) =>{
  try {
    console.log('came here but not karyam')
    const addressResponse = await fetchPinCodeData(pinCode)
    const addressData = JSON.parse(addressResponse);
    const cities = addressData[0].PostOffice.map(PostOffice => PostOffice.Name); 
    console.log(cities, addressData[0].PostOffice[0].Country, addressData[0].PostOffice[0].State, "hhere the adress")
    return({
      pinCode,
      City: cities,
      Country: addressData[0].PostOffice[0].Country,
      State: addressData[0].PostOffice[0].State,
    })
  } catch (error) {
    console.log(error, 'here i log error')
    throw error
  }
}
// Lock a period for a vehicle
const lockPeriod = async (startDate, endDate, vehicleId, userId) => {
  if (!userId) {
      throw new Error('User not authenticated');
  }
  console.log( startDate, endDate, vehicleId, 'her the vars in user controller')
  const uniqueVehicleId =  await PeriodRepository.findAvailableUniqueVehicleWithLowestCount(startDate, endDate, vehicleId)
  // })
  if(!uniqueVehicleId){
    return {
        available: false,
        lockId: null,
    };
  }
  // Check if the vehicle is already locked in the given period
  const existingLock = await withTransaction(async (transaction) => {
     await TempPeriodRepository.findExistingLock(uniqueVehicleId, startDate, endDate, transaction);
  })
  if (existingLock) {
      return {
          available: false,
          lockId: null,
      };
  }
  // Lock the vehicle for the specified period in TempPeriod
  const lock = await TempPeriodRepository.createTempPeriod({
      startDate,
      endDate,
      userId: userId,
      uniqueVehicleId: uniqueVehicleId,
  });

  const amount = calculateAmount(uniqueVehicleId, startDate, endDate)
  
  return {
      available: true,
      lockId: lock.id,
      amount
  };
};

// Create a payment order
const createPayment = async (tempPeriodId, name, mobile) => {
  try {
     // Fetch the TempPeriod record by ID, populating only the uniqueVehicleId
     const tempPeriod = await TempPeriodRepository.findTempPeriodById(tempPeriodId);

     if (!tempPeriod) {
         throw new Error('TempPeriod not found');
     }
    const { startDate, endDate, uniqueVehicleId } = tempPeriod;
    const amount = await calculateAmount(uniqueVehicleId, startDate, endDate)

      const order = await paymentService.createOrder(amount, name, mobile); // Call the new createPayment function
      return {
          success: true,
          orderId: order.orderId,
          amount: order.amount,
          // Include any other details you want to return
      };
  } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Failed to create payment');
  }
};

// Rent a vehicle based on the lock ID
const rentVehicle = async (_, { orderId, paymentId, signature, tempPeriodId }, { user }) => {
  if (!user || !user.id) {
      throw new Error('User not authenticated');
  }
  const isVerified = paymentService.verifyPayment(orderId, paymentId, signature);
  if(! isVerified){
    throw new Error('Payment verification failed')
  }

  // Find the temporary lock period
  const tempLock = await TempPeriodRepository.findByIdAndUserId(tempPeriodId, user.id);
  if (!tempLock) {
      throw new Error('Temporary lock period not found');
  }

  // Move the data from TempPeriod to Period
  const rentedPeriod = await PeriodRepository.createPeriod({
      startDate: tempLock.startDate,
      endDate: tempLock.endDate,
      userId: tempLock.userId,
      uniqueVehicleId: tempLock.uniqueVehicleId,
  });

  // Delete the record from TempPeriod after moving it to Period
  await TempPeriodRepository.deleteTempPeriod(tempPeriodId);

  return {
      success: true,
  };
};



const getUserPeriods = async (userId) => await PeriodRepository.getPeriodByUser(userId)

module.exports = {
    getUserPeriods,
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,  // Export the new update function
  deleteUser,
  fetchAdress,
  getUserPeriods,
  lockPeriod,
  createPayment,
  rentVehicle,
  sentOtp,
  verifyOtp
};
