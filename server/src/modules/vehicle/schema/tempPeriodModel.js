const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../../config/database');
const uniqueVehicle = require('./uniqueVehicleModel');
const User = require('../../users/schema/userModel');

// Define the TempPeriod model
const TempPeriod = sequelize.define('TempPeriod', {
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
    uniqueVehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: uniqueVehicle,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }
});

// Define relationships
TempPeriod.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});
User.hasMany(TempPeriod, {
    foreignKey: 'userId',
    as: 'tempPeriods',
});

TempPeriod.belongsTo(uniqueVehicle, {
    foreignKey: 'uniqueVehicleId',
    as: 'uniqueVehicle',
});
uniqueVehicle.hasMany(TempPeriod, {
    foreignKey: 'uniqueVehicleId',
    as: 'tempPeriods',
});

module.exports = TempPeriod;
