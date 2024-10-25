// modules/vehicle/graph_ql/vehicleType.js
const { gql } = require('apollo-server-express');

const ModelRegistryType = gql`
type ModelRegistry {
  id: ID!
  model: String!
  type: String
  manufacture: String
}

type DeleteResponse {
  success: Boolean!
  message: String!
}

extend type Query {
  modelRegistries: [ModelRegistry]
  modelRegistry(id: ID!): ModelRegistry
}

extend type Mutation {
  createModelRegistry(
    model: String!, 
    manufacture: String, 
    type: String,
  ): ModelRegistry
  updateModelRegistry(
    id: ID!,
    model: String,
    type: String,
    manufacture: String, 
  ): ModelRegistry
  deleteModelRegistry(id: ID!): DeleteResponse
}`;
module.exports = ModelRegistryType;
