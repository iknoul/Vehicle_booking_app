// repositories/periodRepo.js
const { Sequelize, DataTypes, col, fn, literal } = require('sequelize');
const uniqueVehicle = require('../schema/uniqueVehicleModel');
const Vehicle = require('../schema/vehicelModel');
const Period = require('../schema/periodModel');
const TempPeriod = require('../schema/tempPeriodModel');
const withTransaction = require('../../../helpers/trasnsactionManger'); // Adjust the path as necessary
const ModelRegistry = require('../schema/modelRegistryModel');

/**
 * Checks if a given date range overlaps with any existing periods for a specific vehicle.
 *
 * @param {Date} startDate - The start date of the new period.
 * @param {Date} [endDate] - The optional end date of the new period.
 * @param {number} vehicleId - The ID of the vehicle to check against.
 * @returns {Promise<boolean>} - Returns true if there are no overlapping periods, false otherwise.
 */
const isDateRangeAvailable = async (startDate, endDate, vehicleId, transaction) => {
    console.log(startDate, endDate, vehicleId, "here vars");

    // Set default start date to current date if not provided
    if (!startDate) {
        startDate = new Date(); // Current date
    }

    // Set default end date if not provided
    // Assuming that if endDate is not provided, it can be treated as indefinitely far in the future
    if (!endDate) {
        endDate = new Date('9999-12-31'); // Arbitrarily far future date
    }

    try {
        // Check overlapping periods in the Period table
        const overlappingPeriodsCount = await Period.count({
            where: {
                uniqueVehicleId: vehicleId, // Ensure to filter by uniqueVehicleId
                [Sequelize.Op.or]: [
                    {
                        startDate: {
                            [Sequelize.Op.lte]: endDate, // If period starts before or exactly when the range ends
                        },
                        endDate: {
                            [Sequelize.Op.gte]: startDate, // If period ends after or exactly when the range starts
                        },
                    },
                    {
                        startDate: {
                            [Sequelize.Op.between]: [startDate, endDate], // If period starts within the range
                        },
                    },
                    {
                        endDate: {
                            [Sequelize.Op.between]: [startDate, endDate], // If period ends within the range
                        },
                    },
                ],
            },
            transaction
        });

        // Check overlapping periods in the TempPeriod table
        const overlappingTempPeriodsCount = await TempPeriod.count({
            where: {
                uniqueVehicleId: vehicleId, // Ensure to filter by uniqueVehicleId
                [Sequelize.Op.or]: [
                    {
                        startDate: {
                            [Sequelize.Op.lte]: endDate, // If temp period starts before or exactly when the range ends
                        },
                        endDate: {
                            [Sequelize.Op.gte]: startDate, // If temp period ends after or exactly when the range starts
                        },
                    },
                    {
                        startDate: {
                            [Sequelize.Op.between]: [startDate, endDate], // If temp period starts within the range
                        },
                    },
                    {
                        endDate: {
                            [Sequelize.Op.between]: [startDate, endDate], // If temp period ends within the range
                        },
                    },
                ],
            },
            transaction
        });

        // Return true if there are no overlapping periods in both tables, otherwise false
        return overlappingPeriodsCount === 0 && overlappingTempPeriodsCount === 0;
    } catch (error) {
        console.error('Error checking date availability:', error);
        throw new Error('Failed to check period availability');
    }
};

const getPeriodByUser = async (userId) => {

    try {
         // Find all Periods associated with the given userId
        //  const periods = await Period.findAll({
        //     where: { userId },
        //     include: [
        //         {
        //             model: uniqueVehicle,
        //             as: 'uniqueVehicle',
        //             include: [
        //                 {
        //                     model: Vehicle,
        //                     as: 'vehicle',
        //                     attributes: ['id', 'name', 'modelId'], // Include modelId to debug if necessary
        //                     include: [
        //                         {
        //                             model: ModelRegistry, // Include the model data
        //                             as: 'vehicleModel', // Alias used in the association
        //                             // attributes: ['type', 'model', 'manufacture'], // Specify the attributes you want
        //                             attributes: {
        //                                 include: ['type', 'model', 'manufacture'], // Flatten attributes directly here
        //                             },
        //                         },
        //                     ],
        //                     raw: true
        //                 },
        //             ],
        //         },
        //     ],
        // });
        const periods = await Period.findAll({
            where: { userId },
            include: [
                {
                    model: uniqueVehicle,
                    as: 'uniqueVehicle',
                    include: [
                        {
                            model: Vehicle,
                            as: 'vehicle',
                            attributes: [
                                'id',
                                'name',
                                [Sequelize.col('vehicleModel.model'), 'model'], // Use the correct alias path
                                [Sequelize.col('vehicleModel.manufacture'), 'manufacture'], // Use the correct alias path
                                [Sequelize.col('vehicleModel.type'), 'type'], // Use the correct alias path
                            ],
                            include: [
                                {
                                    model: ModelRegistry,
                                    as: 'vehicleModel', // Ensure this alias matches the one used in the association
                                    attributes: ['model', 'type', 'manufacture'], // Do not include the whole ModelRegistry object
                                },
                            ],
                        },
                        
                                // {
                                //     model: Vehicle,
                                //     as: 'vehicle',
                                //     include: [
                                //         {
                                //             model: ModelRegistry,
                                //             as: 'vehicleModel',
                                //             attributes: ['type', 'model'],
                                //         },
                                //     ],
                                // },
                        
                    ],
                },
            ],
        });

        if (!periods || periods.length === 0) {
            return ({
                success: false,
                message: 'No periods found for this user',
            });
        }
        console.log(periods[0].dataValues.uniqueVehicle.vehicle, 'here the periods')
        return periods

    } catch (error) {
        console.error('Error fetching user periods:', error.message);
        throw new Error('An error occurred while fetching user periods')
    }
};

/**
 * Finds a unique vehicle ID that has no overlapping periods with the given date range
 * and selects the one with the least number of periods.
 *
 * @param {Date} startDate - The start date of the new period.
 * @param {Date} [endDate] - The optional end date of the new period.
 * @returns {Promise<number|null>} - Returns the available vehicle ID or null if none are available.
 */
const findAvailableUniqueVehicleWithLowestCount = async (startDate, endDate, vehicleCategoryId, transaction) => {
    try {
        // Find all unique vehicles under the specified vehicle category
        const uniqueVehicles = await uniqueVehicle.findAll({
            where: {
                vehicleId: vehicleCategoryId, // This is the category ID you're passing
            },
            attributes: ['id'], // Get only the ID of unique vehicles
        });

        console.log(uniqueVehicles, 'here the uniqueVehicles @@');

        const availableVehicles = [];

        // Iterate over unique vehicles to check for availability and count periods
        for (const vehicle of uniqueVehicles) {
            const uniqueVehicleId = vehicle.id;

            // Check availability for the unique vehicle
            const isAvailable = await isDateRangeAvailable(startDate, endDate, uniqueVehicleId, transaction);

            if (isAvailable) {
                // If available, count the periods in both tables
                const periodCount = await Period.count({
                    where: {
                        uniqueVehicleId: uniqueVehicleId,
                    },
                });

                const tempPeriodCount = await TempPeriod.count({
                    where: {
                        uniqueVehicleId: uniqueVehicleId,
                    },
                });

                // Store vehicle ID and total period count in the array
                availableVehicles.push({
                    uniqueVehicleId,
                    totalPeriods: periodCount + tempPeriodCount, // Total count from both tables
                });
            }
        }

        // If no available vehicles, return null
        if (availableVehicles.length === 0) {
            return null;
        }

        // Sort available vehicles by total period count and return the one with the lowest count
        availableVehicles.sort((a, b) => a.totalPeriods - b.totalPeriods);
        return availableVehicles[0].uniqueVehicleId; // Return the unique vehicle ID with the lowest period count

    } catch (error) {
        console.error('Error finding available unique vehicle:', error);
        throw new Error('Failed to find an available unique vehicle with the lowest period count');
    }
};

const getPeriodById = async (id) => {
    return await Period.findByPk(id);
};

const getPeriodsByVehicleId = async (vehicleId) => {
    try {
        const periods = await Period.findAll({
            include: [{
                model: uniqueVehicle,
                as: 'uniqueVehicle',
                where: { vehicleId },
            }],
        });
        return periods;
    } catch (error) {
        throw new Error('Failed to fetch periods for the vehicle');
    }
};

const createPeriod = async (data) => {
    return await withTransaction(async (transaction) => {
        return await Period.create({...data, status:'Booked'}, { transaction });
    });
};

const updatePeriod = async (id, data) => {
    return await withTransaction(async (transaction) => {
        const period = await Period.findByPk(id, { transaction });
        if (period) {
            return await period.update(data, { transaction });
        }
        throw new Error('Period not found');
    });
};

const deletePeriod = async (id) => {
    return await withTransaction(async (transaction) => {
        const period = await Period.findByPk(id, { transaction });
        if (period) {
            return await period.destroy({ transaction });
        }
        throw new Error('Period not found');
    });
};

module.exports = {
    createPeriod,
    getPeriodByUser,
    getPeriodById,
    updatePeriod,
    deletePeriod,
    getPeriodsByVehicleId,
    isDateRangeAvailable,
    findAvailableUniqueVehicleWithLowestCount,
};
