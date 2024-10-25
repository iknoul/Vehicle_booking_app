const uniqueVehicle = require('../modules/vehicle/schema/uniqueVehicleModel');
const Vehicle = require('../modules/vehicle/schema/vehicelModel');

/**
 * Calculate the amount for a given locking period
 * @param {number} uniqueVehicleId - The ID of the unique vehicle
 * @param {string} startDate - The start date of the locking period (YYYY-MM-DD)
 * @param {string} endDate - The end date of the locking period (YYYY-MM-DD)
 * @returns {number} - The calculated amount
 */
async function calculateAmount(uniqueVehicleId, startDate, endDate) {
    // Parse the start and end dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the number of days in the period
    const timeDiff = end.getTime() - start.getTime();
    const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (numberOfDays <= 0) {
        throw new Error('End date must be after start date');
    }

    // Get the vehicle price
    const uniqueVehicleRecord = await uniqueVehicle.findByPk(uniqueVehicleId, {
        include: {
            model: Vehicle,
            as: 'vehicle',
        },
    });

    if (!uniqueVehicleRecord || !uniqueVehicleRecord.vehicle) {
        throw new Error('Vehicle not found');
    }

    const vehiclePrice = uniqueVehicleRecord.vehicle.price;
    // Calculate the total amount
    const totalAmount = numberOfDays * vehiclePrice;

    return totalAmount;
}

module.exports = calculateAmount;
