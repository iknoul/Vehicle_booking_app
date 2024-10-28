const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../../config/database'); // Your database configuration

const ModelRegistry  = sequelize.define('vehicel-model', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    model: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false        
    },
    manufacture: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = ModelRegistry;

