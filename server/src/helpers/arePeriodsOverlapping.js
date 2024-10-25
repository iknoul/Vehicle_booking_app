// Function to check if two date periods overlap
export const arePeriodsOverlapping = (start1, end1, start2, end2) => {
  // Convert strings to Date objects if necessary
  start1 = new Date(start1);
  end1 = end1 ? new Date(end1) : undefined; // Handle undefined end date
  start2 = new Date(start2);
  end2 = end2 ? new Date(end2) : undefined; // Handle undefined end date

  // Check if the periods overlap
  if (end1 === undefined) {
    // If end1 is undefined, it means the period extends indefinitely
    return start2 >= start1; // Overlap if start2 is after start1
  }

  if (end2 === undefined) {
    // If end2 is undefined, it means the second period extends indefinitely
    return start1 >= start2; // Overlap if start1 is after start2
  }

  // Normal case for defined start and end dates
  return !(end1 < start2 || start1 > end2);
};

// List of existing periods (dynamically updated)
const existingPeriods = [
  { start: '2024-09-01', end: '2024-09-15' },
  { start: '2024-10-01', end: undefined }, // This period extends indefinitely
  { start: '2024-10-20', end: '2024-10-30' },
];

// Function to check if a new period can be added
export const canAddNewPeriod = (newPeriod) => {
  const isOverlapping = existingPeriods.some(period => 
    arePeriodsOverlapping(period.start, period.end, newPeriod.start, newPeriod.end)
  );

  return !isOverlapping;  // Return true if no overlap
};

// Function to dynamically create a new period
const createNewPeriod = (newPeriod) => {
  if (canAddNewPeriod(newPeriod)) {
    existingPeriods.push(newPeriod);  // Add new period to list if no overlap
    console.log("New period added:", newPeriod);
  } else {
    console.log("Cannot add new period, it overlaps with existing periods.");
  }
};

// Example: Creating a new period dynamically
const newPeriodToAdd = { start: '2024-09-10', end: undefined }; // This should overlap
createNewPeriod(newPeriodToAdd);  // Will not be added due to overlap
