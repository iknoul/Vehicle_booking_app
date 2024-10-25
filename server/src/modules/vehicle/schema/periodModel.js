// models/periodModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../../config/database');
const uniqueVehicle = require('./uniqueVehicleModel');
const User = require('../../users/schema/userModel');

// Define the Period model
const Period = sequelize.define('Period', {
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    }, 
    status: {
        type: DataTypes.STRING,
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
    },
});

// Define relationships
Period.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});
User.hasMany(Period, {
    foreignKey: 'userId',
    as: 'periods',
});

Period.belongsTo(uniqueVehicle, {
    foreignKey: 'uniqueVehicleId',
    as: 'uniqueVehicle',
});
uniqueVehicle.hasMany(Period, {
    foreignKey: 'uniqueVehicleId',
    as: 'periods',
});


module.exports = Period;
