const { GraphQLUpload } = require('graphql-upload');
const userController = require('../../controllers/userController');
const jwt = require('./../../../../services/jwt-servise')

const uploadProfilePic = require('./../../../../../utils/uploadImage')


const userMutations = {

  Upload: GraphQLUpload, // Add this line to handle Upload scalar
  
  Mutation: {
    createUser: async (_, { name, email, mobile, password, profilePic, token }, {user}) => {
      try {
        const data = jwt.verifyToken(token); // Verify the token
        if(!data || !(data.mobile == mobile) || !(data.stage === 'otpVerified')){
          throw new Error('Forbidden: Invalid token.');
        }
      } catch (error) {
          console.error('Token verification failed:', error);
          throw new Error('Forbidden: Invalid token.'); // Throw an error for invalid token
      }
      console.log('came here')
      // const profilePicUrl = await uploadProfilePic(profilePic);
      
      const newUser = await userController.createUser({
        name,
        email,
        mobile,
        password,
        profilePic,
      })
      console.log('here but not @@@@@@@')
      return newUser;
    },
    updateUser: async (_, { name, email, mobile, password, profilePic }, {user}) => {

      return await userController.updateUser(user.id, {
        name,
        email,
        mobile,
        password,
        image:profilePic
      })
    },
    deleteUser: async (_, { id }, {user}) => {
      console.log(id)
      const result = await userController.deleteUser(id);
      return result;
    },
    checkotp: async (_, { }, {user}) => {
      if(!user){
        throw new Error("you are not authorized")
      }
      console.log(user, 'her user')
      return await userController.sentOtp(user.mobile);
    },
    confirmOtp: async (_, { otp }, {user}) => {
      return await userController.verifyOtp(user.mobile, otp, user.id);
    },
    changePassword: async (_, {token ,newPassword}, {user}) => {
      try {
        const data = jwt.verifyToken(token); // Verify the token
        if(!data || !(data.mobile ==user.mobile) || !(data.stage === 'accessToChangePassword')){
          throw new Error('Forbidden: Invalid token.');
        }
      } catch (error) {
          console.error('Token verification failed:', error);
          throw new Error('Forbidden: Invalid token.'); // Throw an error for invalid token
      }
      await userController.updateUser(user.id, {password: newPassword})
      return {success:true, message: "password updated succesfully"}
    },
    lockPeriod: async(_, { startDate, endDate, vehicleId }, {user}) => {
      console.log(user?.id, 'here the use id')
      const result = await userController.lockPeriod(startDate, endDate, vehicleId, user?.id);
      console.log(result, 'result here in mutaion')
      return result;
    },
    createPayment: async(_, { tempPeriodId }, {user}) => {
      return await userController.createPayment(tempPeriodId, user.name, user.mobile)
    },
    verifyPayment: userController.rentVehicle

    
  },
};

module.exports = userMutations;
