const uniqueVehicleController = require('../../controllers/uniqueVehicleController')


const modelRegistryQueries = {
    Query: {
      uniqueVehicle: async () => {
        return await uniqueVehicleController.createUniqueVehicle({vehicleId});
      },
      uniqueVehicleById: async (_, { id }) => {
        return await modelRegistryController.uniqueVehicleController(id);
      },
    },
  };
  
  module.exports = modelRegistryQueries;