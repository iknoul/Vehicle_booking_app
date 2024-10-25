// modules/vehicle/graph_ql/vehicleQueries.js
const vehicleController = require('../../controllers/vehicleController');
const {getPeriodCountByDateAndVehicleModel} = require('../../repositories/periodRepo')
const vehicleQueries = {
  Query: {
    vehicles: async (_, { model, minPrice, maxPrice, startDate, endDate, limit, filter }) => {
      return await vehicleController.getAllVehicles({ model, minPrice, maxPrice, startDate, endDate, limit, filter });
    },
    vehicle: async (_, { id }) => {
      return await vehicleController.getVehicleById(id);
    },
    PeroidByDate: async(_, {}) => {
      return await getPeriodCountByDateAndVehicleModel()
    }
  },
};


module.exports = vehicleQueries;
