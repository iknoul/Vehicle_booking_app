const { gql } = require('apollo-server-express');

const baseSchema = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

module.exports = baseSchema;
