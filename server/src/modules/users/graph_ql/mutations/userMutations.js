const { GraphQLUpload } = require('graphql-upload');
const userController = require('../../controllers/userController');
const uploadProfilePic = require('./../../../../../utils/uploadImage')


const userMutations = {

  Upload: GraphQLUpload, // Add this line to handle Upload scalar
  
  Mutation: {
    createUser: async (_, { name, email, mobile, password, profilePic }, {user}) => {
      console.log('came here')
      // const profilePicUrl = await uploadProfilePic(profilePic);

      const newUser = await userController.createUser({
        name,
        email,
        mobile,
        password,
        profilePic
      })
      console.log('here but not @@@@@@@')
      return newUser;
    },
    updateUser: async (_, { name, email, mobile, password, profilePic }, {user}) => {

      const newUser = await userController.createUser({
        name,
        email,
        mobile,
        password,
        profilePic
      })
      console.log('here but not @@@@@@@')
      return newUser;
    },
    deleteUser: async (_, { id }, {user}) => {
      console.log(id)
      const result = await userController.deleteUser(id);
      return result;
    },
    
    lockPeriod: async(_, { startDate, endDate, vehicleId }, {user}) => {
      console.log(user?.id, 'here the use id')
      const result = await userController.lockPeriod(startDate, endDate, vehicleId, user?.id);
      console.log(result, 'result here in mutaion')
      return result;
    },
    createPayment: async(_, { tempPeriodId }, {user}) => {
      return await userController.createPayment(tempPeriodId)
    },
    verifyPayment: userController.rentVehicle
    
  },
};

module.exports = userMutations;
