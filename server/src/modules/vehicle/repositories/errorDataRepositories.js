const ErrorData = require("../schema/errorDataModel");

// Find all vehicles
const findAllErrorData= async () => {

    return await ErrorData.findAll();
};

const saveErrorData = async (errorRows, groupId) => {
    try {
        // Save each error row to the ErrorData table
        for (const row of errorRows) {
            await ErrorData.create({
                groupId,
                rowIndex: row.rowIndex,
                model: row.model || null,
                type: row.type || null,
                manufacture: row.manufacture || null,
                errorMessage: row.errorMessage,
            });
        }
        console.log('Error data saved successfully.');
    } catch (err) {
        console.error('Failed to save error data:', err);
        throw new Error('Unable to save error data.');
    }
};

const deleteErrorById = async (id) => {
    try {
        const result = await ErrorData.destroy({
            where: { id }
        });

        if (result === 0) {
            console.log(`No error found with ID ${id}.`);
            throw new Error('Error not found');
        }

        console.log(`Error with ID ${id} deleted successfully.`);
    } catch (err) {
        console.error(`Failed to delete error with ID ${id}:`, err);
        throw new Error('Unable to delete error data.');
    }
};

module.exports = {
    saveErrorData,
    findAllErrorData,
    deleteErrorById
}