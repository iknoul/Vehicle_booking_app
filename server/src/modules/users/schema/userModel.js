const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../../config/database'); // Your database configuration

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  mobile: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING
  },
  profilePic: {
    type: DataTypes.STRING, // This is already set correctly
    allowNull: true
  }
});

module.exports = User;
