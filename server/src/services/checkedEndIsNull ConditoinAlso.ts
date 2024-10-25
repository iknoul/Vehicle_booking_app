const { Op } = require('sequelize');

// Function to find non-overlapping buses, including handling periods with undefined or null end date
const findNonOverlappingBuses = async (startDate, endDate, minPriority) => {
  // Find all buses where none of the periods overlap with the given range
  const buses = await Bus.findAll({
    include: [
      {
        model: Period,
        as: 'periods',
        where: {
          [Op.and]: [
            // Non-overlapping periods (same as before)
            {
              [Op.or]: [
                // Period ends before the new start date (no overlap)
                { end: { [Op.lte]: startDate } },
                // Period starts after the new end date (no overlap)
                { start: { [Op.gte]: endDate } },
              ],
            },
            // Ongoing periods (end is null)
            {
              [Op.or]: [
                // Check for ongoing periods where end is null
                { end: null }, // Ongoing period
                // OR new start date is after the ongoing period's start date
                { start: { [Op.gt]: endDate } },
              ],
            },
          ],
        },
      },
    ],
    // Filter buses by minimum priority
    where: {
      priority: {
        [Op.gte]: minPriority,  // Filter buses with priority greater or equal to minPriority
      },
    },
  });

  return buses;
};


const startDate = new Date('2024-11-01');
const endDate = new Date('2024-11-15');
const minPriority = 2;

findNonOverlappingBuses(startDate, endDate, minPriority).then(buses => {
  console.log('Non-overlapping buses:', buses);
});


