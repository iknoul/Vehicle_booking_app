// modules/vehicle/controllers/vehicleController.js
const vehicleRepository = require('../repositories/vehicleRepositories')
const uniqueVehicleRepository = require('../repositories/uniqueVehicleRepo')
const periodRepository = require('../repositories/periodRepo')
const minioClient = require('../../../../config/minioClient'); // Import MinIO client
const typesenseClient = require('../../../../config/typesenseClient'); // Import Typesense client
const { v4: uuidv4 } = require('uuid'); // Use uuid for unique file names
const { addOrUpdateVehicleInTypesense, fetchVehiclesFromTypesense } = require('../typesense/vehicleTypesense');
const { findModelRegistryById } = require('../repositories/modelRegistryRespositories');
const uniqueVehicle = require('../schema/uniqueVehicleModel');
const {hasNoPeriods} = require('../repositories/uniqueVehicleRepo')
const withTransaction = require('../../../helpers/trasnsactionManger'); // Adjust the path as necessary
require('dotenv').config({ path: './../.env' });

const bucketName = 'your-bucket-name'; // MinIO bucket name

// Get all vehicles from Typesense
const getAllVehicles = async (filters = {}) => {
  try {

      const vehicles = await fetchVehiclesFromTypesense(filters);

      if(filters.startDate || filters.endDate){
        try {
          // Fetch all specific vehicles
          // const vehicles = await vehicleRepository.findAllVehicles(filters);

          // Filter vehicles where there are no overlapping periods
          const availableVehicles = [];
          for (const vehicle of vehicles) {
              const isAvailable = await periodRepository.findAvailableUniqueVehicleWithLowestCount(filters.startDate, filters.endDate, vehicle.id);
              if (isAvailable) {
                  availableVehicles.push(vehicle);
              }
          }
          console.log(availableVehicles, "here the available vehicles")

          return availableVehicles;
        } catch (error) {
            console.error('Error filtering available vehicles:', error);
            throw new Error('Failed to filter available vehicles');
        }
      }
      // Fetch from Typesense instead of PostgreSQL
      console.log(vehicles, "here the vehicles from type sense")
      return vehicles;
   
  } catch (error) {
    throw new Error('Failed to fetch vehicles from Typesense');
  }
};

// Get a vehicle by ID from Typesense
const getVehicleById = async (id) => {
  try {
    const vehicle = await typesenseClient.collections('vehicles').documents(id).retrieve();
    console.log('Fetched vehicle from Typesense:', vehicle);
    return vehicle;
  } catch (error) {
    console.error(`Error fetching vehicle with ID ${id} from Typesense:`, error);
    throw new Error('Vehicle not found in Typesense');
  }
};
const getPeriodsByVehicleId = async (req, res) => {
  const { vehicleId } = req.params;
  try {
      const periods = await periodRepository.getPeriodsByVehicleId(vehicleId);
      return res.status(200).json(periods);
  } catch (error) {
      console.error('Error fetching periods:', error);
      return res.status(500).json({ error: 'Failed to fetch periods' });
  }
};

// Create a new vehicle (including image upload to MinIO)
const createVehicle = async ({ name, price, description, quantity, images:imagePromises, modelId }) => {
	console.log('Received images:', imagePromises);
	console.log('her the minoi end point', process.env.MINIO_END_POINT)
	const images = await Promise.all(imagePromises)
	try {
		const bucketExists = await minioClient.bucketExists(bucketName);
		if (!bucketExists) {
			await minioClient.makeBucket(bucketName, 'us-east-1');
		}
    	const imageUrls = [];
		// Loop through each image, upload to MinIO, and store the URLs
		if (images && images.length > 0) {
			for (const img of images) {
				const imageName = uuidv4() + '.' + img.filename.split('.').pop(); // Use the original file extension
				const imageStream = img.createReadStream(); // Assuming img is a file stream

				// Upload the image stream to MinIO
				await minioClient.putObject(bucketName, imageName, imageStream);
				const imageUrl = `${minioClient.protocol}//${process.env.MINIO_END_POINT}:${process.env.MINIO_PORT}/${bucketName}/${imageName}`;
				imageUrls.push(imageUrl);
				console.log('Uploaded image URL:', imageUrl);
			}
		} else {
			// console.log('No images provided for upload.');
		}
		const modelDetails = await findModelRegistryById(modelId);
		if (!modelDetails) {
		throw new Error('Invalid model ID');
		}
   		delete modelDetails.dataValues.id;

		console.log(modelDetails.dataValues, 'here i put the model details')
		// console.log(dle, 'i dont what her do here')

		// Save vehicle to PostgreSQL and Typesense
		const newVehicle = await vehicleRepository.createVehicle({
		name,
		modelId,
		price,
		description,
		quantity,
		imageUrl: imageUrls, // Save the array of image URLs
		});
		// console.log(newVehicle, "here the new vehicle")
		// Sync vehicle with Typesense

		console.log('New vehicle created and synced with Typesense:', newVehicle);
		await addOrUpdateVehicleInTypesense({...newVehicle.dataValues, ...modelDetails.dataValues});
	
		// Create unique vehicles and associated empty periods
		for (let i = 0; i < quantity; i++) {
		const newUniqueVehicle = await uniqueVehicleRepository.createUniqueVehicle({ vehicleId: newVehicle.id });
		// Create an empty period for each unique vehicle
		// await periodRepository.createPeriod({ uniqueVehicleId: newUniqueVehicle.id, startDate: null, endDate: null });
		}
    	return newVehicle;
	} catch (error) {
		console.error('Error creating vehicle:', error);
		throw new Error('Failed to create vehicle');
	}
};

// Update a vehicle (including image upload handling if necessary)
const updateVehicle = async (id, updatedVehicleData) => {
	try {
		const { images } = updatedVehicleData;
		// Handle image upload to MinIO if new images are provided
		if (images && images.length > 0) {
			const bucketExists = await minioClient.bucketExists(bucketName);
			if (!bucketExists) {
				await minioClient.makeBucket(bucketName, 'us-east-1');
			}
			const imageUrls = [];
			for (const img of images) {
				const imageName = uuidv4() + '.' + img.filename.split('.').pop(); // Use the original file extension
				const imageStream = img.createReadStream(); // Assuming img is a file stream
				// Upload the image stream to MinIO
				await minioClient.putObject(bucketName, imageName, imageStream);
				const imageUrl = `${minioClient.protocol}//192.168.10.28:9000/${bucketName}/${imageName}`;
				imageUrls.push(imageUrl);
			}
			updatedVehicleData.imageUrl = imageUrls; // Update imageUrl with the new image URLs
		}
		// Call the repository method to update the vehicle in the database
		const updatedVehicle = await vehicleRepository.updateVehicle(id, updatedVehicleData);
		// Sync updated vehicle with Typesense
		await addOrUpdateVehicleInTypesense(updatedVehicle);
		return updatedVehicle;
	} catch (error) {
		console.error('Error updating vehicle:', error);
		throw new Error('Failed to update vehicle');
	}
};

// Delete a vehicle by ID
	const deleteVehicle = async (id) => {
	try {
		// Use withTransaction to ensure atomicity
		await withTransaction(async (transaction) => {
			// Find all unique vehicles associated with the vehicle
			const uniqueVehicles = await uniqueVehicle.findAll({
				where: { vehicleId: id },
				transaction, // Include transaction here
			});
			// Check if all unique vehicles have no periods or temp periods
			const allHaveNoPeriods = await Promise.all(
				uniqueVehicles.map(async (uniqueVehicle) => {
					return await hasNoPeriods(uniqueVehicle.id, transaction); // Pass the transaction to hasNoPeriods
				})
			);
			// If any unique vehicle has associated periods, throw an error
			if (allHaveNoPeriods.includes(false)) {
				throw new Error('Cannot delete the vehicle as some unique vehicles have associated periods.');
			}

			// Delete all unique vehicles associated with the vehicle
			await uniqueVehicle.destroy({
				where: { vehicleId: id },
				transaction, // Include transaction here
			});

			// Delete the vehicle itself
			const isDeleted = await vehicleRepository.deleteVehicle(id, transaction); // Pass the transaction to the deleteVehicle method
			if (isDeleted) {
				await typesenseClient.collections('vehicles').documents(id).delete();
				return { success: true, message: 'Vehicle deleted successfully' };
			} else {
				throw new Error('Vehicle not found');
			}
      	});
	} catch (error) {
		console.error(`Error deleting vehicle with ID ${id}:`, error);
		throw new Error('Failed to delete vehicle');
	}
};
module.exports = {
	getAllVehicles,
	getVehicleById,
	createVehicle,
	updateVehicle,
	deleteVehicle,
};
