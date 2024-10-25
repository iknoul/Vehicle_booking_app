// modules/vehicle/repositories/vehicleRepository.js
const ModelRegistry = require('../schema/modelRegistryModel'); // Sequelize model

// Find all vehicles
const findAllModelRegistry= async () => {

  return await ModelRegistry.findAll();
};

// Find a vehicle by ID
const findModelRegistryById = async (id) => {
  return await ModelRegistry.findByPk(id);
};

// Create a new vehicle
const createModelRegistry = async ({ model, manufacture, type }) => {
  return await ModelRegistry.create({ 
    model, 
    manufacture, 
    type,
  });
};

// Update a vehicle by ID
// Update a vehicle by ID
const updateModelRegistry = async (id, updatedData) => {
  try {
    // Find the vehicle by primary key (id)
    const modelRegistry = await ModelRegistry.findByPk(id);
    console.log(updatedData, "here the founeded registry")
    // If vehicle doesn't exist, throw an error
    if (!modelRegistry) {
      throw new Error('Vehicle not found');
    }
    // Update the vehicle with the new data
    const updatedModelRegistry = await modelRegistry.update(updatedData);

    return updatedModelRegistry;
  } catch (error) {
    console.error('Error updating vehicle in the repository:', error);
    throw new Error('Failed to update vehicle');
  }
};

// Delete a vehicle by ID
const deleteModelRegistry = async (id) => {
  const modelRegistry = await ModelRegistry.findByPk(id);
  if (modelRegistry) {
    await modelRegistry.destroy();
    return true;
  }
  return false;
};

module.exports = {
  findAllModelRegistry,
  findModelRegistryById,
  createModelRegistry,
  updateModelRegistry,
  deleteModelRegistry,
};
