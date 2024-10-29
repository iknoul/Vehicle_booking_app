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
const TempPeriod = require('../schema/tempPeriodModel');
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

const updateVehicle = async (id, updateVehicleData) => {
    const { images: imagePromises } = updateVehicleData;
    console.log('Received images:', imagePromises);
    console.log('Here the MinIO endpoint:', updateVehicleData);
    console.log(id, 'here the id');

    try {
        // Process images
        const images = await Promise.all(imagePromises);
        console.log('Here not the problem');

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
                const imageUrl = `${minioClient.protocol}//${process.env.MINIO_END_POINT}:${process.env.MINIO_PORT}/${bucketName}/${imageName}`;
                imageUrls.push(imageUrl);
                console.log(imageUrl, "fdgs");
            }
            updateVehicleData.image = imageUrls; // Update imageUrl with the new image URLs
            console.log('Updated image URLs:', updateVehicleData.imageUrl); // Log the updated image URLs
        }

        // Call the repository method to update the vehicle in the database
        let updatedVehicle = await vehicleRepository.updateVehicle(id, updateVehicleData);
        console.log(updatedVehicle, 'here update');

        if (!updatedVehicle) {
            throw new Error(`Vehicle update failed for id ${id}`);
        }

        if (updateVehicleData.modelId) {
            // Fetch model details
            const modelDetails = await findModelRegistryById(updateVehicleData.modelId);
            if (!modelDetails) {
                throw new Error(`Model details not found for id ${updateVehicleData.modelId}`);
            }
            delete modelDetails.dataValues.id;
            updatedVehicle = { ...updatedVehicle, ...modelDetails };
        }

        // Sync updated vehicle with Typesense
        await addOrUpdateVehicleInTypesense({ ...updatedVehicle.dataValues, id }); // Ensure the `id` is included in the JSON body
        console.log('actually here the problem is ...`');

        return { success: true, message: "Vehicle updated successfully" };
    } catch (error) {
        console.error('Error updating vehicle:', error);
        throw new Error('Failed to update vehicle');
    }
};






// delete the vehicle if there is no current period associated with it
const deleteVehicle = async (id) => {
    try {
        const result = await withTransaction(async (transaction) => {
            console.log('Initiating delete process for vehicle ID:', id);

            const uniqueVehicles = await uniqueVehicle.findAll({ where: { vehicleId: id }, transaction });
            console.log('Unique vehicles associated with vehicle ID:', id, uniqueVehicles);

            const allHaveNoPeriods = await Promise.all(uniqueVehicles.map(async (uniqueVehicle) => {
                return await hasNoPeriods(uniqueVehicle.id, transaction);
            }));
            console.log('Checked for periods:', allHaveNoPeriods);

            if (allHaveNoPeriods.includes(false)) {
                throw new Error('Cannot delete the vehicle as some unique vehicles have associated periods.');
            }

            console.log('Deleting TempPeriods associated with unique vehicles...');
            await TempPeriod.destroy({ where: { uniqueVehicleId: uniqueVehicles.map(uv => uv.id) }, transaction });

            console.log('Deleting unique vehicles...');
            await uniqueVehicle.destroy({ where: { vehicleId: id }, transaction });

            console.log('Unique vehicles associated with vehicle ID after deletion:', id, await uniqueVehicle.findAll({ where: { vehicleId: id }, transaction }));

            console.log('Deleting main vehicle entry...');
            const isDeleted = await vehicleRepository.deleteVehicle(id, transaction);

            if (isDeleted) {
                console.log('Deleting from Typesense...');
                const deleteResult = await typesenseClient.collections('vehicles').documents(id).delete();
                console.log(deleteResult, 'Vehicle deleted successfully.');
                return { success: true, message: 'Vehicle deleted successfully' };
            } else {
                throw new Error('Vehicle not found');
            }
        });

        // Logging result outside the transaction
        console.log(result, 'Result before return');
        return result;
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
