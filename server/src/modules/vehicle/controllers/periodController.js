const periodService = require('../services/periodService');

// Create a new period
exports.createPeriod = async (req, res) => {
    try {
        const period = await periodService.createPeriod(req.body);
        res.status(201).json(period);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a period
exports.updatePeriod = async (req, res) => {
    try {
        const period = await periodService.updatePeriod(req.params.id, req.body);
        res.status(200).json(period);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
