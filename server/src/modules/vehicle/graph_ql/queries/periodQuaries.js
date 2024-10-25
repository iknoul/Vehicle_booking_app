const uniqueVehicleController = require('../../controllers/uniqueVehicleController')


const modelRegistryQueries = {
    Query: {
      uniqueVehicle: async () => {
        return await modelRegistryController.getAllModelRegistry();
      },
      uniqueVehicle: async (_, { id }) => {
        return await modelRegistryController.uniqueVehicleController(id);
      },
    },
  };
  
  module.exports = modelRegistryQueries;