// modules/vehicle/graph_ql/vehicleMutations.js
const { GraphQLUpload } = require('graphql-upload'); // For handling file uploads
const modelRegistryController = require('../../controllers/modelRegisteryController');
const CustomError = require('../../../../customError')

const modelRegistryMutations = {
    Upload: GraphQLUpload, // Add this line to support file uploads
    Mutation: {
        createModelRegistry: async (_, { model, manufacture, type }, { user }) => {

            if(!user.role === 'admin' ){
                throw new Error('UnAuthorized, you don`t have access to this route')
            }
            
            const newVehicleModel = await modelRegistryController.createModelRegistry({
                model,
                manufacture, // Array of image URLs
                type,
            });
            return newVehicleModel;
        },
        uploadModelRegistryExcel: async (_, { file }, { user }) => {

            if(!user.role === 'admin' ){
                throw new Error('UnAuthorized, you don`t have access to this route')
            }
            const { createReadStream, filename } = await file;
            const stream = createReadStream();
            try {
                const { errorRows, file: errorFile, filename: errorFilename } = await modelRegistryController.processExcelFile(stream, filename);
                if (errorRows.length > 0) {
                    // Return the error file and filename
                    return {
                        success: false,
                        errorRows,
                        file: errorFile,
                        filename: errorFilename
                    };
                } else {
                    return {
                        success: true,
                        errorRows: []
                    };
                }
            } catch (err) {
                console.error('File processing error:', err);
                throw new Error('Failed to process the uploaded Excel file.');
            }
        },        
        
        uploadModelRegistryExcel: async (_, { file }, { user }) => {

            if(!user.role === 'admin' ){
                throw new Error('UnAuthorized, you don`t have access to this route')
            }

            const { createReadStream, filename } = await file;
            const stream = createReadStream();
            try {
                const { errorRows, file: errorFile, filename: errorFilename } = await modelRegistryController.processExcelFile(stream, filename);
                
                // Return the error file if there are errors, or indicate success
                return {
                    success: errorRows.length === 0,
                    errorRows,
                    file: errorFile,
                    filename: errorFilename,
                };
            } catch (err) {
                console.error('File processing error:', err);
                throw new Error('Failed to process the uploaded Excel file.');
            }
        },
        
        deleteModelRegistry: async (_, { id }, { user }) => {

            if(!user.role === 'admin' ){
                throw new Error('unAuthorized, you don`t have access to this route')
            }

            console.log(id)
            const result = await modelRegistryController.deleteModelRegistry(id);
            return result;
        },
    },
};
module.exports = modelRegistryMutations;
