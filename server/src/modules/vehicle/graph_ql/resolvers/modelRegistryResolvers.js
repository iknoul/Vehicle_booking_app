// modules/vehicle/graph_ql/vehicleResolver.js
const modelRegistryQueries = require('../queries/modelRegistryQueries');
const modelRegistryMutations = require('../mutations/modelRegistryMutations');

const modelRegistryResolvers = {
  ...modelRegistryQueries,
  ...modelRegistryMutations,
};

module.exports = modelRegistryResolvers;
