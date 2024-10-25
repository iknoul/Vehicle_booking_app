// services/syncService.js
const typesenseClient = require('../../config/typesenseClient');

async function syncVehicleToTypesense(vehicle) {
  const vehicleId = vehicle.id; // Use the correct ID field

  try {
    // Check if the document exists first
    await typesenseClient.collections('vehicles').documents(vehicleId).retrieve();
    
    // If the document exists, update it
    await typesenseClient.collections('vehicles').documents(vehicleId).update(vehicle);
    console.log('Vehicle updated in Typesense:', vehicle);
  } catch (error) {
    if (error.httpStatus === 404) {
      // If the document does not exist, create it
      await typesenseClient.collections('vehicles').documents().create(vehicle);
      console.log('Vehicle created in Typesense:', vehicle);
    } else {
      // For other errors, log them
      console.error('Error syncing vehicle to Typesense:', error);
      throw error; // Re-throw for further handling
    }
  }
}

module.exports = {
  syncVehicleToTypesense
};
