// modules/user/repositories/userRepository.js
const User = require('../schema/userModel'); // Sequelize model
const { Op } = require('sequelize'); // Ensure you import Op from Sequelize

// Find all users with optional filters
const findAllUsers = async ({ model, type, minPrice, maxPrice, limit } = {}) => {
  
  return await User.findAll();
};

// Find a user by ID
const findUserById = async (id) => {
  return await User.findByPk(id);
};

// Create a new user
const createUser = async ({ name, email, mobile, password, profilePic }) => {
  console.log("222 @@@@ ####")
  return await User.create({ 
    name, 
    email, 
    mobile, 
    password, 
    profilePic, // Saving the first image URL or modify based on your logic,
  });
};

// Update a User by ID
// Update a User by ID
const updateUser = async (id, updatedData) => {
  console.log(updatedData.imageUrl, "image url")
  try {
    // Find the User by primary key (id)
    const user = await User.findByPk(id);

    // If User doesn't exist, throw an error
    if (!user) {
      throw new Error('User not found');
    }
    // Update the User with the new data
    const updatedUser = await user.update(updatedData);

    return updatedUser;
  } catch (error) {
    console.error('Error updating user in the repository:', error);
    throw new Error('Failed to update user');
  }
};

// Delete a user by ID
const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (user) {
    await user.destroy();
    return true;
  }
  return false;
};

module.exports = {
  findAllUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
};
