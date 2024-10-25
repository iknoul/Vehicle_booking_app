const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../../config/database');
const ModelRegistry = require('./modelRegistryModel'); // Import your model table

// Define your vehicle table
const Vehicle = sequelize.define('vehicels', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.ARRAY(DataTypes.STRING), // This is already set correctly
        allowNull: true
    }, 
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    modelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ModelRegistry, // Reference to ModelRegistry table
            key: 'id', // Foreign key is the `id` in the `vehicel-model` table
        },
        onUpdate: 'CASCADE', // When the model's id is updated
        onDelete: 'SET NULL', // What happens if a model is deleted
    }
});

// Define the relationship between Vehicle and ModelRegistry
Vehicle.belongsTo(ModelRegistry, {
    foreignKey: 'modelId',
    as: 'vehicleModel', // Alias used in the association
});

ModelRegistry.hasMany(Vehicle, {
    foreignKey: 'modelId',
    as: 'vehicles', // Alias used in the association
});

module.exports = Vehicle;
