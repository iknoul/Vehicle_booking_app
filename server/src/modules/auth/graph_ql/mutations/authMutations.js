// modules/vehicle/graph_ql/vehicleQueries.js
const authController = require('../../controllers/authController');

const authQueries = {
  Mutation: {
    sendOtp: async (_, { mobile }) => {
      return await authController.sentOtp(mobile);
    },
    verifyOtp: async (_, { mobile, otp }) => {
      return await authController.verifyOtp(mobile, otp);
    },
    login: async(_, {mobile, password}) => {
      return await authController.logIn(mobile, password)
    }
  },
};


module.exports = authQueries;
