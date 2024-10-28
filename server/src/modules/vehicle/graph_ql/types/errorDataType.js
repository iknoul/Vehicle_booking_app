// modules/errorData/schema/errorDataSchema.js

const { gql } = require('apollo-server-express');

const errorDataTypeDefs = gql`
  type ErrorData {
    id: Int!
    groupId: String!
    rowIndex: Int!
    model: String
    type: String
    manufacture: String
    errorMessage: String!
  }

  type Query {
    errorData: [ErrorData!]!
  }
`;

module.exports = errorDataTypeDefs;
