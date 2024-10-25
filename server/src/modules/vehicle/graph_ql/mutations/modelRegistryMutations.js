// modules/vehicle/graph_ql/vehicleMutations.js
const modelRegistryController = require('../../controllers/modelRegisteryController');
const CustomError = require('../../../../customError')

const modelRegistryMutations = {
    Mutation: {
        createModelRegistry: async (_, { model, manufacture, type }) => {
            console.log(_, "idk")
            console.log('type here and .. rest', model, manufacture, type)

            const newVehicleModel = await modelRegistryController.createModelRegistry({
                model,
                manufacture, // Array of image URLs
                type,
            });
            return newVehicleModel;
        },
        updateModelRegistry: async (_, { id, model, manufacture, type }, { req, res }) => {
            const updatedVehicleModel = await modelRegistryController.updateModelRegistry(id, {
                model,
                manufacture,
                type,
            });
            // return res.status(201).json(updatedVehicle);
            return updatedVehicleModel;
        },
        deleteModelRegistry: async (_, { id }) => {
            console.log(id)
            const result = await modelRegistryController.deleteModelRegistry(id);
            return result;
        },
    },
};
module.exports = modelRegistryMutations;
