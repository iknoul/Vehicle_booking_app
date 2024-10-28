import { gql } from '@apollo/client';

export const CREATE_VEHICLE_MODEL_MUTATION = gql`
  mutation CreateModelRegistry($model: String!, $type: String!, $manufacture: String!) {
    createModelRegistry(model: $model, type:$type, manufacture: $manufacture) {
      model
      type
      manufacture
    }
  }
`;

export const DELETE_VEHICLE_MODEL_MUTATION = gql`
  mutation DeleteModelRegistry($id: ID!) {
    deleteModelRegistry(id: $id) {
      success
      message
    }
  }
`;

export const UPDATE_VEHICLE_MODEL_MUTATION = gql`
  mutation updateModelRegistry(
    $id: ID!,
    $model: String,
    $type: String,
    $manufacture: String,
  ) {
    updateModelRegistry(
      id: $id,
      manufacture: $manufacture,
      model: $model,
      type: $type,
    ) {
      id
      model
      type
      manufacture
    }
  }
`;

export const UPLOAD_EXCEL_MUTATION = gql`
  mutation UploadModelRegistryExcel($file: Upload!) {
    uploadModelRegistryExcel(file: $file) {
      success
      errorRows{
        rowIndex
        errorMessage
      }
      file  # Add this line
      filename  # Add this line
    }
  }
`;

