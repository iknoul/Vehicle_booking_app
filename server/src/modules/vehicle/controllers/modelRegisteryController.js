// modules/vehicle/controllers/vehicleController.js
const modelRegistryRepository = require('../repositories/modelRegistryRespositories'); // Repository layer
const xlsx = require('xlsx'); // Library for reading Excel files

// Get all vehicles
const getAllModelRegistry= async () => {
  	return await modelRegistryRepository.findAllModelRegistry();
};

// Get a vehicle by ID
const getModelRegistryById = async (id) => {
  	return await modelRegistryRepository.findModelRegistryById(id);
};

// Create a new vehicle (including image upload to MinIO)
const createModelRegistry = async ({ model, manufacture, type}) => {
	try {
		// Save vehicle to the database
		const newVehicle = await modelRegistryRepository.createModelRegistry({
			model,
			manufacture,
			type,
		});
		return newVehicle;
	} catch (error) {
		console.error('Error creating vehicle:', error);
		throw new Error('Failed to create vehicle');
	}
};
const processExcelFile = async (stream, filename) => {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    try {
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(worksheet);

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            throw new Error('The uploaded file does not contain any sheets.');
        }
        if (rows.length === 0) {
            throw new Error('No data found in the Excel file.');
        }

        const errorRows = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            try {
                if (!row.model || typeof row.model !== 'string') {
                    throw new Error('Model name is missing or invalid');
                }

                await modelRegistryRepository.createModelRegistry({
                    model: row.model,
                    type: row.type || null,
                    manufacture: row.manufacture || null,
                });
            } catch (error) {
                errorRows.push({ rowIndex: i + 2, ...row, errorMessage: error.message });
            }
        }

        if (errorRows.length > 0) {
            const errorHeaders = ["Row Index", "Model", "Type", "Manufacture", "Error Message"];
            const errorWorksheetData = [errorHeaders, ...errorRows.map(row => [
                row.rowIndex,
                row.model,
                row.type,
                row.manufacture,
                row.errorMessage
            ])];

            const errorWorksheet = xlsx.utils.aoa_to_sheet(errorWorksheetData);

            // Add color to error message cells
            const range = xlsx.utils.decode_range(errorWorksheet['!ref']);
            for (let row = range.s.r + 1; row <= range.e.r; row++) {
                const cellAddress = xlsx.utils.encode_cell({ c: 4, r: row }); // Column 4 is the error message column
                const cell = errorWorksheet[cellAddress];
                if (cell) {
                    cell.s = {
                        fill: {
                            fgColor: { rgb: "FF0000" } // Red background for errors
                        },
                        font: {
                            color: { rgb: "FFFFFF" } // White text color
                        }
                    };
                }
            }

            const errorWorkbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(errorWorkbook, errorWorksheet, "Error Rows");

            const excelBuffer = xlsx.write(errorWorkbook, { type: 'buffer', bookType: 'xlsx' });
            const errorFile = excelBuffer.toString('base64');
            const errorFilename = 'error_rows.xlsx';

            return {
                success: false,
                errorRows,
                file: errorFile,
                filename: errorFilename
            };
        }

        return { success: true, errorRows: [] };
    } catch (error) {
        console.error('Error processing Excel file:', error);
        throw new Error('Failed to process Excel file');
    }
};


// Update a vehicle (including image upload handling if necessary)
const updateModelRegistry = async (id, updatedVehicleModelData) => {
	try {
		// Call the repository method to update the vehicle in the database
		const updatedVehicleModel = await modelRegistryRepository.updateModelRegistry(id, updatedVehicleModelData);
		return updatedVehicleModel;
	} catch (error) {
		console.error('Error updating vehicle:', error);
		throw new Error('Failed to update vehicle');
	}
};
// Delete a vehicle by ID
const deleteModelRegistry = async (id) => {
	const isDeleted = await modelRegistryRepository.deleteModelRegistry(id);
	if (isDeleted) {
		return { success: true, message: 'Vehicle deleted successfully' };
	} else {
		throw new Error('Vehicle not found');
	}
};

module.exports = {
	getAllModelRegistry,
	getModelRegistryById,
	createModelRegistry,
	updateModelRegistry,  // Export the new update function
	deleteModelRegistry,
	processExcelFile
};
