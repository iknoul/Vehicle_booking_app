// services/graphql/queries/errorDataQueries.js
import { gql } from '@apollo/client';

export const FETCH_ERROR_DATA = gql`
  query GetErrorData {
    errorData {
      id
      groupId
      rowIndex
      model
      type
      manufacture
      errorMessage
    }
  }
`;
