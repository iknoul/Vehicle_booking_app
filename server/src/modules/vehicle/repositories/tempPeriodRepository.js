const TempPeriod = require('../schema/tempPeriodModel');
const withTransaction = require('../../../helpers/trasnsactionManger');
const { Op } = require('sequelize');

class TempPeriodRepository {

    static async findTempPeriodById(tempPeriodId) {
        return await withTransaction(async (transaction) => {
            return await TempPeriod.findByPk(tempPeriodId, {transaction});; // Pass the transaction here
        });
    }
    // Find a TempPeriod by vehicle ID and date range
    static async findExistingLock(uniqueVehicleId, startDate, endDate, transaction) {
        return await TempPeriod.findOne({
            where: {
                uniqueVehicleId: uniqueVehicleId,
                [Op.or]: [
                    {
                        startDate: {
                            [Op.between]: [startDate, endDate],
                        },
                    },
                    {
                        endDate: {
                            [Op.between]: [startDate, endDate],
                        },
                    },
                ],
            },
            transaction, // Pass the transaction here if it exists
        });
    }

    // Create a new TempPeriod
    static async createTempPeriod(data) {
        return await withTransaction(async (transaction) => {
            return await TempPeriod.create(data, { transaction }); // Pass the transaction here
        });
    }

    // Find a TempPeriod by ID and user ID
    static async findByIdAndUserId(lockId, userId) {
        return await TempPeriod.findOne({
            where: {
                id: lockId,
                userId: userId,
            },
        });
    }

    // Delete a TempPeriod by ID
    static async deleteTempPeriod(lockId) {
        return await withTransaction(async (transaction) => {
            return await TempPeriod.destroy({
                where: { id: lockId },
                transaction, // Pass the transaction here
            });
        });
    }
}

module.exports = TempPeriodRepository;
