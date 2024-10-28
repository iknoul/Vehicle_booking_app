// modules/vehicle/graph_ql/vehicleQueries.js
const errorDataController = require('../../controllers/errorDataController');

const errorDataQueries = {
  Query: {
    errorData: async () => {
      return await errorDataController.getAllErrorData();
    },
    // modelRegistry: async (_, { id }) => {
    //   return await modelRegistryController.getModelRegistryById(id);
    // },
  },
};

module.exports = errorDataQueries;
