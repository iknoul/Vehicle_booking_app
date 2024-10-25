// repositories/uniqueVehicleRepo.js
const Period = require('../schema/periodModel');
const TempPeriod = require('../schema/tempPeriodModel');
const uniqueVehicle = require('../schema/uniqueVehicleModel');

// Function to check if a unique vehicle has any associated periods
const hasNoPeriods = async (uniqueVehicleId) => {
    // const transaction = await sequelize.transaction();
    // Check both Period and TempPeriod tables for any records linked to the unique vehicle
    const periodsCount = await Period.count({
        where: { uniqueVehicleId }
    });

    const tempPeriodsCount = await TempPeriod.count({
        where: { uniqueVehicleId }
    });

    // If there are no records in both tables, return true
    return periodsCount === 0 && tempPeriodsCount === 0;
};

const createUniqueVehicle = async (data) => {
    return await uniqueVehicle.create(data);
};


module.exports = {
    createUniqueVehicle,
    hasNoPeriods,
};
