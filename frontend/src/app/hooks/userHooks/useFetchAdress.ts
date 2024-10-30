import { useQuery } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { FETCH_ADRESS_QUERY } from '../../Services/graphql/queries/adressQuaries';

interface Adress {
    State: String,
    Country: String,
    pinCode: String,
    City: [String]
}

interface UseFetchAdressResult {
  address: Adress;
  loading: boolean;
  error: any;  // Adjust based on the error type
  refetch: (variables?: any) => void;  // Add refetch function to the return type
}



export const useFetchAdress = (pinCode: string): UseFetchAdressResult => {
  console.log(pinCode, "her the pinCode")
  const { loading, error, data, refetch } = useQuery(FETCH_ADRESS_QUERY, {
    client: apolloClient,
    variables: {
      pinCode
    },
  });

  console.log('Fetched vehicles:', data?.fetchAdress);

  return {
    loading,
    error,
    address: data?.fetchAdress || null,
    refetch,  // Return refetch function
  };
};
