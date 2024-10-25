// modules/vehicle/graph_ql/vehicleResolver.js
const vehicleQueries = require('../queries/vehicleQueries');
const vehicleMutations = require('../mutations/vehicleMutations');

const vehicleResolvers = {
  ...vehicleQueries,
  ...vehicleMutations,
};

module.exports = vehicleResolvers;
