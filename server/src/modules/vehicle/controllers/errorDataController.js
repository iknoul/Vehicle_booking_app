// modules/vehicle/controllers/vehicleController.js
const errorDataRepositories = require('../repositories/errorDataRepositories'); // Repository layer

// Get all vehicles
const getAllErrorData= async () => {
  	return await errorDataRepositories.findAllErrorData();
};


module.exports = {
	getAllErrorData
};
