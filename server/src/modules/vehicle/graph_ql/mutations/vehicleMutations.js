// modules/vehicle/graph_ql/vehicleMutations.js
const { GraphQLUpload } = require('graphql-upload');
const vehicleController = require('../../controllers/vehicleController');
const { validateVehicle } = require("../../../../middlewares/validateMiddleware")
const CustomError = require('../../../../customError')

const vehicleMutations = {

  Upload: GraphQLUpload, // Add this line to handle Upload scalar

  Mutation: {
    createVehicle: async (_, { name, price, modelId, description, quantity, image }) => {

      if (!user) { // Assume req.user is set by some middleware
        // console.log('herer but hereeee', res)
        res.statusCode = 800; // Set status code using the res object
        // console.log('look here you may found', res.statusCode)
        throw new CustomError('You must be logged in to create a user.', 901);
      }
      validateVehicle({ name, price, modelId, description, quantity, image })
      console.log(_, "idk")
      const newVehicle = await vehicleController.createVehicle({
        name,
        price,
        modelId,
        description,
        quantity,
        images: image,  // Array of image URLs
      });
      return newVehicle;
    },
    updateVehicle: async (_, { id, name, price, description, quantity, image, modelId }, { req, res }) => {
      const updatedVehicle = await vehicleController.updateVehicle(id, {
        name,
        modelId,
        price,
        description,
        quantity,
        images: image,  // Array of image URLs
      });
      // return res.status(201).json(updatedVehicle);
      return updatedVehicle;
    },
    deleteVehicle: async (_, { id }) => {
      console.log(id)
      const result = await vehicleController.deleteVehicle(id);
      return result;
    },
  },
};

module.exports = vehicleMutations;
