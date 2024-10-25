// modules/vehicle/graph_ql/vehicleQueries.js
const userController = require('../../controllers/userController');

const userQueries = {
  Query: {
    users: async (_,) => {
      return await userController.getAllUsers();
    },
    user: async (_, { id }) => {
      return await userController.getUserById(id);
    },
    fetchAdress: async (_, {pinCode}) => {
      return await userController.fetchAdress(pinCode);  
    },
    periodsByUser: async (_, {}, {user}) => {
      console.log('here inside the peiod')
      console.log(user?.id,'herer the use id')
      return await userController.getUserPeriods(user?.id)
    },
    doit: async() =>{
      return('heloo')
    }
  },
};


module.exports = userQueries;
