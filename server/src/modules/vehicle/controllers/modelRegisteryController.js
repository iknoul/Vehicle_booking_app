// modules/vehicle/controllers/vehicleController.js
const modelRegistryRepository = require('../repositories/modelRegistryRespositories'); // Repository layer

// Get all vehicles
const getAllModelRegistry= async () => {
  	return await modelRegistryRepository.findAllModelRegistry();
};

// Get a vehicle by ID
const getModelRegistryById = async (id) => {
  	return await modelRegistryRepository.findModelRegistryById(id);
};

// Create a new vehicle (including image upload to MinIO)
const createModelRegistry = async ({ model, manufacture, type}) => {
	try {
		// Save vehicle to the database
		const newVehicle = await modelRegistryRepository.createModelRegistry({
			model,
			manufacture,
			type,
		});
		return newVehicle;
	} catch (error) {
		console.error('Error creating vehicle:', error);
		throw new Error('Failed to create vehicle');
	}
};

// Update a vehicle (including image upload handling if necessary)
const updateModelRegistry = async (id, updatedVehicleModelData) => {
	try {
		// Call the repository method to update the vehicle in the database
		const updatedVehicleModel = await modelRegistryRepository.updateModelRegistry(id, updatedVehicleModelData);
		return updatedVehicleModel;
	} catch (error) {
		console.error('Error updating vehicle:', error);
		throw new Error('Failed to update vehicle');
	}
};
// Delete a vehicle by ID
const deleteModelRegistry = async (id) => {
	const isDeleted = await modelRegistryRepository.deleteModelRegistry(id);
	if (isDeleted) {
		return { success: true, message: 'Vehicle deleted successfully' };
	} else {
		throw new Error('Vehicle not found');
	}
};

module.exports = {
	getAllModelRegistry,
	getModelRegistryById,
	createModelRegistry,
	updateModelRegistry,  // Export the new update function
	deleteModelRegistry,
};
