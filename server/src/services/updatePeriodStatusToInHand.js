// scheduler.js

const cron = require('node-cron');
const { updatePeriodStatusToInHand, updatePeriodStatusReturned } = require('../modules/vehicle/repositories/periodRepo');

// Existing cron job (if any)
// cron.schedule('*/5 * * * *', async () => {
//     console.log('Running existing scheduled task...');
//     // Your existing task logic here
// });

// New task: Update period status to 'In Hand' every night at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Running nightly scheduled task to update period status...');
        await updatePeriodStatusToInHand()
        await updatePeriodStatusReturned()
        console.log('Nightly period status update completed.');
    } catch (error) {
        console.error('Error running nightly scheduled task:', error);
    }
});

console.log('Nightly scheduler started. Tasks are running as scheduled.');
