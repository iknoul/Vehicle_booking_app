import { gql } from '@apollo/client';

export const FETCH_ADRESS_QUERY= gql`
  query FetchAdress($pinCode: String) {
    fetchAdress(
      pinCode: $pinCode, 
    ) {
      City
      Country
      pinCode
      State
    }
  }
`;