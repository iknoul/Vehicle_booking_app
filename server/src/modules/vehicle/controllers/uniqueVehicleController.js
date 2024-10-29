const uniqueVehicleService = require('../services/uniqueVehicleService');

// Create a new unique vehicle
exports.createUniqueVehicle = async (req, res) => {
    try {
        const uniqueVehicle = await uniqueVehicleService.createUniqueVehicle(req.body);
        res.status(201).json(uniqueVehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a unique vehicle
exports.updateUniqueVehicle = async (req, res) => {
    try {
        const uniqueVehicle = await uniqueVehicleService.updateUniqueVehicle(req.params.id, req.body);
        res.status(200).json(uniqueVehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

