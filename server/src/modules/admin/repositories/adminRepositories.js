// modules/user/repositories/userRepository.js
const User = require('../schema/adminModel'); // Sequelize model
const { Op } = require('sequelize'); // Ensure you import Op from Sequelize

// Find all users with optional filters
const findAllUsers = async ({ model, type, minPrice, maxPrice, limit } = {}) => {
  
  return await User.findAll();
};

// Find a user by ID
const findUserById = async (id) => {
  return await User.findByPk(id);
};


module.exports = {
  findAllUsers,
  findUserById,
};
