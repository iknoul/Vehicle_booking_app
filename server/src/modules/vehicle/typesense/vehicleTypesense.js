// modules/vehicle/vehicleTypesense.js
const { syncVehicleToTypesense } = require('../../../services/syncService');
const typesenseClient = require('../../../../config/typesenseClient'); // Assuming your client is in the config folder

// Function to add or update a vehicle in Typesense
async function addOrUpdateVehicleInTypesense(vehicleData) {
  try {
    console.log(vehicleData, 'here the vehicle data before id to strinf')

    // Convert ID to string (important for Typesense)
    vehicleData.id = vehicleData.id.toString();
    console.log(vehicleData, 'here the vehicle data after id to strinf')
    await syncVehicleToTypesense(vehicleData); // Sync service that handles data format and upsertion
  } catch (error) {
    console.error('Error syncing vehicle with Typesense:', error);
    throw error; // Re-throw error to be handled by the controller
  }
}

// Function to fetch/search vehicles from Typesense
async function fetchVehiclesFromTypesense(filters) {
  let filterString = [];
  let queryString = [];
  console.log(filters, "here the filter")
  // Check if model is defined and add to filter string
  if (filters.model) {
    queryString.push(`${filters.model}`); // Exact match for model
  }

  // Check if type is defined and add to filter string
  if (filters.type) {
    queryString.push(`${filters.type}`); // Exact match for type
  }

  // Check if minPrice and maxPrice are defined and add to filter string
  if (filters.minPrice !== undefined) {
    filterString.push(`price:>=${filters.minPrice}`);
  }
  if (filters.maxPrice !== undefined) {
    filterString.push(`price:<=${filters.maxPrice}`);
  }

  // Join all filter strings with '&&' for AND logic
  const filterStringJoined = filterString.length > 0 ? filterString.join(' ') : '';
  const queryStringJoined = queryString.length> 0 ? queryString.join(' ') : '*'  
  console.log(queryStringJoined,filterStringJoined, 'the filters inside the typses')
  try {
    const searchParams = {
      q: queryStringJoined, // Search query
      query_by: 'name,description,model,type, manufacture', // The fields to search within
      filter_by: filterStringJoined, // Use the joined filter string here
    };
    // If the filter is true, add sorting by price
    if (filters.filter === true) {
      searchParams.sort_by = 'price:asc'; // Sorting by price in ascending order
    }
    const searchResults = await typesenseClient.collections('vehicles').documents().search(searchParams);
    console.log(searchResults, "here the results")
    return searchResults.hits.map(hit => hit.document); // Return the matched documents (vehicles)
  } catch (error) {
    console.error('Error fetching vehicles from Typesense:', error);
    throw error; // Re-throw error to be handled by the controller
  }
}

module.exports = {
  addOrUpdateVehicleInTypesense,
  fetchVehiclesFromTypesense,  // Export the fetch function as well
};
