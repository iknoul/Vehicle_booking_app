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
type ErrorRow {
  rowIndex: Int!
  errorMessage: String!
}
type ErrorFile {
  file: String  # Use base64 encoded string for file
  filename: String!
}
type UploadResponse {
  success: Boolean!
  errorRows: [ErrorRow]!
  file: String  # Optional for error files
  filename: String  # Optional for error files
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
  uploadModelRegistryExcel(file: Upload!): UploadResponse
}`;
module.exports = ModelRegistryType;
