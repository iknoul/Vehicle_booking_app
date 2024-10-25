const { Op, fn, col, literal } = require('sequelize');

// Function to find buses with fewer periods, high priority, and no overlapping periods (including handling undefined endDate)
const findBusesWithFewPeriodsAndHighPriority = async (startDate, endDate, minPriority) => {
  // Find buses with fewer periods, prioritized by higher bus priority
  const buses = await Bus.findAll({
    attributes: [
      'id',            // Bus attributes
      'name',          // Bus name
      'priority',      // Bus priority
      [fn('COUNT', col('periods.id')), 'periodCount'], // Count the number of periods for each bus
    ],
    include: [
      {
        model: Period,
        as: 'periods',
        attributes: [], // We just need to count the periods, so don't include the period data
        where: {
          [Op.or]: [
            // 1. Non-overlapping periods with provided endDate
            endDate
              ? {
                  [Op.or]: [
                    // Period ends before the new start date
                    { end: { [Op.lte]: startDate } },
                    // Period starts after the new end date
                    { start: { [Op.gte]: endDate } },
                  ],
                }
              : {
                  // 2. No endDate (ongoing periods) - check ongoing periods that start after the new start date
                  [Op.or]: [
                    // Period ends before the new start date
                    { end: { [Op.lte]: startDate } },
                    // Ongoing period (end = null) that starts after the new start date (overlap)
                    { end: null, start: { [Op.gte]: startDate } },
                  ],
                },
          ],
        },
        required: false, // LEFT JOIN: Include buses even if they have no periods
      },
    ],
    group: ['Bus.id'],  // Group by Bus to count periods per bus
    having: {
      // Ensuring minimum bus priority
      priority: { [Op.gte]: minPriority },
    },
    order: [
      [literal('periodCount'), 'ASC'],   // Order by fewest periods first
      ['priority', 'DESC'],              // Order by highest priority
    ],
  });

  return buses;
};



const startDate = new Date('2024-11-01');
const endDate = null;  // End date not provided (open-ended period)
const minPriority = 2;

findBusesWithFewPeriodsAndHighPriority(startDate, endDate, minPriority).then(buses => {
  console.log('Buses with few periods, high priority, and no overlaps:', buses);
});
