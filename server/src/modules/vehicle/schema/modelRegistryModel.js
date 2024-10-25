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
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING
    },
    manufacture: {
        type: DataTypes.STRING,
    },
});

module.exports = ModelRegistry;

