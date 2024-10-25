// modules/vehicle/graph_ql/vehicleQueries.js
const modelRegistryController = require('../../controllers/modelRegisteryController');

const modelRegistryQueries = {
  Query: {
    modelRegistries: async () => {
      return await modelRegistryController.getAllModelRegistry();
    },
    modelRegistry: async (_, { id }) => {
      return await modelRegistryController.getModelRegistryById(id);
    },
  },
};

module.exports = modelRegistryQueries;
