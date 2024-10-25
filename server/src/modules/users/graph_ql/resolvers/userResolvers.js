// modules/user/graph_ql/userResolver.js
const userQueries = require('../queries/userQueries');
const userMutations = require('../mutations/userMutations');

const userResolvers = {
  ...userQueries,
  ...userMutations,
};

module.exports = userResolvers;
