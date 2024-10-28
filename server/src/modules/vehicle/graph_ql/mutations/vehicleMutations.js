// modules/vehicle/graph_ql/vehicleMutations.js
const { GraphQLUpload } = require('graphql-upload');
const vehicleController = require('../../controllers/vehicleController');
const { validateVehicle } = require("../../../../middlewares/validateMiddleware")
const CustomError = require('../../../../customError')

const vehicleMutations = {

  Upload: GraphQLUpload, // Add this line to handle Upload scalar

  Mutation: {
    createVehicle: async (_, { name, price, modelId, description, quantity, image }, { user }) => {

      if(!user.role === 'admin' ){
        throw new Error('UnAuthorized, you don`t have access to this route')
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
    updateVehicle: async (_, { id, name, price, description, quantity, image, modelId }, { user }) => {

      if(!user.role === 'admin' ){
        throw new Error('UnAuthorized, you don`t have access to this route')
      }
      
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
    deleteVehicle: async (_, { id }, { user }) => {

      if(!user.role === 'admin' ){
        throw new Error('UnAuthorized, you don`t have access to this route')
      }

      const result = await vehicleController.deleteVehicle(id);
      return result;
    },
  },
};

module.exports = vehicleMutations;
