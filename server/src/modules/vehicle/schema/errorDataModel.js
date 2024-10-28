const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../../config/database'); // Your database configuration

const ErrorData = sequelize.define('error-data', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    groupId: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Identifier to group related errors together',
    },
    rowIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'The row index in the original Excel file where the error occurred',
    },
    model: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'The model value that caused the error',
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'The type value that caused the error',
    },
    manufacture: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'The manufacture value that caused the error',
    },
    errorMessage: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'The error message explaining the issue',
    },
});

module.exports = ErrorData;
