// src/createVehicleCollection.js

const typesenseClient = require('.././../../../config/typesenseClient'); // Adjust the path as necessary
const vehicleSchema = require('./typesenseVehicleSchema.'); // Adjust the path as necessary

async function createVehicleCollection() {
  try {
    const response = await typesenseClient.collections().create(vehicleSchema);
    console.log('Collection created:', response);
  } catch (error) {
    console.error('Error creating collection:', error);
  }
}

// Call the function to create the collection
createVehicleCollection();
