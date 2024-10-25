const cron = require('node-cron');
const TempPeriod = require('../modules/vehicle/schema/tempPeriodModel'); // Adjust the path as necessary
const { Op } = require('sequelize');

// Schedule a cron job to run every minute to clean up expired TempPeriods
cron.schedule('* * * * *', async () => {
    try {
        console.log('Running cleanup for expired TempPeriods...');
        const currentTime = new Date(); // Get the current time
        const expirationTime = new Date(currentTime.getTime() - 5 * 60 * 1000); // Calculate the expiration time

        // Delete records older than 5 minutes
        const result = await TempPeriod.destroy({
            where: {
                createdAt: {
                    [Op.lt]: expirationTime, // Find records created before the expiration time
                },
            },
        });

        console.log(`Cleaned up ${result} expired TempPeriods.`);
    } catch (error) {
        console.error('Error cleaning up expired TempPeriods:', error);
    }
});
