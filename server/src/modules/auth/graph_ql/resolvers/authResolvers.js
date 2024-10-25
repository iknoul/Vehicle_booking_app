// modules/user/graph_ql/userResolver.js
const authQueries = require('../queries/authQueries');
const authMutations = require('../mutations/authMutations');


const userResolvers = {
  ...authQueries,
  ...authMutations,
};

module.exports = userResolvers;
