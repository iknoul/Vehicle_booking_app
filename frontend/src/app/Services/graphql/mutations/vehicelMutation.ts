import { gql } from '@apollo/client';

export const CREATE_VEHICLE_MUTATION = gql`
  mutation CreateVehicle($name: String!, $modelId: String, $description: String!, $price: Float!, $quantity: Int!, $image: [Upload!]) {
    createVehicle(name: $name, modelId: $modelId, description: $description, price: $price, quantity: $quantity, image: $image) {
      id
      name
      description
      price
      quantity
      image
    }
  }
`;

export const DELETE_VEHICLE_MUTATION = gql`
  mutation DeleteVehicle($id: ID!) {
    deleteVehicle(id: $id) {
      success
      message
    }
  }
`;

export const UPDATE_VEHICLE_MUTATION = gql`
  mutation UpdateVehicle(
    $id: ID!,
    $name: String,
    $modelId: String,
    $image: [String],
    $price: Float,
    $description: String,
    $quantity: Int
  ) {
    updateVehicle(
      id: $id,
      name: $name,
      modelId: $modelId,
      image: $image,
      price: $price,
      description: $description,
      quantity: $quantity
    ) {
      id
      name
      modelId
      price
      description
      quantity
      image
    }
  }
`;

