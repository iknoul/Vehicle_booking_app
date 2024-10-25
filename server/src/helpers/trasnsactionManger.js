// services/transactionManager.js
const sequelize  = require('../../config/database'); // Adjust the import according to your project structure

const withTransaction = async (callback) => {
    const transaction = await sequelize.transaction();
    try {
        const result = await callback(transaction);
        await transaction.commit();
        return result;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = withTransaction;
