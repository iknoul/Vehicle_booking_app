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
      const a =  await userController.getUserPeriods(user?.id)
      console.log(a, 'here a @@@')
      return a
    },
    doit: async() =>{
      return('heloo')
    }
  },
};


module.exports = userQueries;
