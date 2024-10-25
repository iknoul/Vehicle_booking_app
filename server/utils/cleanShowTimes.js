const Showtime = require('../src/modules/Theater/models/show-time-schema'); // Adjust path as needed
const Seat = require('../src/modules/Theater/models/seat-schema'); // Adjust path as needed

// Function to delete outdated showtimes and their associated seats
const deleteOutdatedShowtimes = async () => {
    try {
		// Find outdated showtimes
		const outdatedShowtimes = await Showtime.find({
			date: { $lt: new Date().toISOString().split('T')[0] }
		}).populate('bookedSeats');

		if (outdatedShowtimes.length === 0) {
			console.log('No outdated showtimes found.');
			return;
		}

		// Collect all booked seat IDs from outdated showtimes
		const seatIdsToDelete = outdatedShowtimes.reduce((acc, showtime) => {
			return acc.concat(showtime.bookedSeats.map(seat => seat._id));
		}, []);

		// Delete seats associated with outdated showtimes
		const seatDeletionResult = await Seat.deleteMany({ _id: { $in: seatIdsToDelete } });
		console.log(`Deleted ${seatDeletionResult.deletedCount} seats associated with outdated showtimes.`);

		// Delete outdated showtimes
		const showtimeDeletionResult = await Showtime.deleteMany({
			date: { $lt: new Date().toISOString().split('T')[0] }
		});
		console.log(`Deleted ${showtimeDeletionResult.deletedCount} outdated showtimes.`);

    } catch (error) {
      	console.error('Error deleting outdated showtimes and their associated seats:', error);
    }
};

// Export the function for external use
module.exports = deleteOutdatedShowtimes;

