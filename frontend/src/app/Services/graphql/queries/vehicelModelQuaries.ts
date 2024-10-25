import { gql } from '@apollo/client';

export const FETCH_VEHICLES_MODEL_QUERY = gql`
  query ModelRegistries {
    modelRegistries {
      id
      model
      type
      manufacture
    }
  }
`;
