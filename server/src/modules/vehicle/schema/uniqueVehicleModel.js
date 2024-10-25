// models/uniqueVehicleModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../../config/database');
const vehicel = require('./vehicelModel');

// Define the Unique Vehicle model
const uniqueVehicle = sequelize.define('uniqueVehicles', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: vehicel,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    }
});

// Define relationships
uniqueVehicle.belongsTo(vehicel, {
    foreignKey: 'vehicleId',
    as: 'vehicle',
});

vehicel.hasMany(uniqueVehicle, {
    foreignKey: 'vehicleId',
    as: 'uniqueVehicles',
});

// Hook to enforce quantity constraint before creating a new unique vehicle
uniqueVehicle.beforeCreate(async (newUniqueVehicle, options) => {
    const vehicle = await vehicel.findOne({
        where: { id: newUniqueVehicle.vehicleId },
    });

    if (!vehicle) {
        throw new Error('Vehicle not found');
    }

    const existingCount = await uniqueVehicle.count({
        where: { vehicleId: newUniqueVehicle.vehicleId },
    });

    if (existingCount >= vehicle.quantity) {
        throw new Error('Cannot create more unique vehicles than the available quantity');
    }
});

module.exports = uniqueVehicle;
