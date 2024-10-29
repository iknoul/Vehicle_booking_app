// modules/vehicle/repositories/vehicleRepository.js
const Vehicle = require('../schema/vehicelModel'); // Sequelize model
const Model = require('../schema/modelRegistryModel'); // Adjust the path based on your directory structure
const {  } = require('sequelize'); // Ensure you import Op from Sequelize
const { Op } = require('sequelize');


// Find all vehicles with optional filters
const findAllVehicles = async ({ model:keyword, type, manufacture, minPrice, maxPrice, limit } = {}) => {
  const whereClause = {};
  
  // Create an array to hold the OR conditions
  const orConditions = [];

  // Check if a keyword is provided and add conditions for model, type, and manufacture
  if (keyword) {
    orConditions.push({
      '$vehicleModel.model$': {
        [Op.iLike]: `%${keyword}%` // Search in the model field
      },
    });
    orConditions.push({
      '$vehicleModel.type$': {
        [Op.iLike]: `%${keyword}%` // Search in the type field
      },
    });
    orConditions.push({
      '$vehicleModel.manufacture$': {
        [Op.iLike]: `%${keyword}%` // Search in the manufacture field
      },
    });
  }

  // If any orConditions exist, add them to the whereClause using Op.or
  if (orConditions.length > 0) {
    whereClause[Op.or] = orConditions;
  }

  
  
  // Filter by price range in Vehicle
  if (minPrice || maxPrice) {
    whereClause.price = {
      ...(minPrice ? { [Op.gte]: minPrice } : {}),
      ...(maxPrice ? { [Op.lte]: maxPrice } : {}),
    };
  }

  return await Vehicle.findAll({
    where: whereClause,
    include: {
      model: Model, // Include the model data
      as: 'vehicleModel', // Alias used in the association
      attributes: ['type', 'model', 'id', 'manufacture'], // Adjust based on the attributes you want from the model
    },
    limit: limit ? parseInt(limit) : undefined, // Limit results if provided
    raw: true, // Use raw to flatten the result
    attributes: {
      include: ['vehicleModel.type', 'vehicleModel.model', 'vehicleModel.manufacture'], // Flatten attributes directly here
    },
    // attributes: {
    //   include: [
    //     // Include attributes from the included model directly in the main object
    //     [col('vehicleModel.type'), 'type'], // Rename to vehicleType
    //     [col('vehicleModel.model'), 'model'], // Rename to vehicleModelName
    //     [col('vehicleModel.manufacture'), 'manufacture'], // Rename to vehicleManufacture
    //   ],
    // },
  });
};

// Find a vehicle by ID
const findVehicleById = async (id) => {
  return await Vehicle.findByPk(id, {
    include: {
      model: Model, // Include the model data
      as: 'vehicleModel', // Alias used in the association,
      attributes: ['type', 'model', 'manufacture', 'id'], // Adjust based on the attributes you want from the model
    },
  });
};

// Create a new vehicle
const createVehicle = async ({ name, price, description, quantity, imageUrl, modelId }) => {
  console.log("222 @@@@ ####")
  return await Vehicle.create({ 
    name, 
    price, 
    description, 
    quantity, 
    image: imageUrl, // Saving the first image URL or modify based on your logic,
    modelId,
  });
};

// Update a vehicle by ID
// Update a vehicle by ID
const updateVehicle = async (id, updatedData) => {
  console.log(updatedData.imageUrl, "image url")
  try {
    // Find the vehicle by primary key (id)
    const vehicle = await Vehicle.findByPk(id);

    // If vehicle doesn't exist, throw an error
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    // Update the vehicle with the new data
    const updatedVehicle = await vehicle.update(updatedData);

    return updatedVehicle;
  } catch (error) {
    console.error('Error updating vehicle in the repository:', error);
    throw new Error('Failed to update vehicle');
  }
};

// Delete a vehicle by ID
const deleteVehicle = async (id, transaction) => {
  const vehicle = await Vehicle.findByPk(id);
  if (vehicle) {
    await vehicle.destroy({transaction});
    return true;
  }
  return false;
};

module.exports = {
  findAllVehicles,
  findVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
