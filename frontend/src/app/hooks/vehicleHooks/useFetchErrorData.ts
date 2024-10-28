import { useQuery } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { FETCH_ERROR_DATA } from '../../Services/graphql/queries/errorDataQuaries';

interface ErrorData {
  id: number;
  groupId: string;
  rowIndex: number;
  model?: string;
  type?: string;
  manufacture?: string;
  errorMessage: string;
}

interface UseFetchErrorDataResult {
  errorData: ErrorData[];
  loading: boolean;
  error: any; // Adjust based on the error type, e.g., ApolloError
  refetch: () => void;
}

export const useFetchErrorData = (): UseFetchErrorDataResult => {
  const { loading, error, data, refetch } = useQuery(FETCH_ERROR_DATA, {
    client: apolloClient,
  });

  console.log('Fetched error data:', data?.errorData);

  return {
    loading,
    error,
    errorData: data?.errorData || [],
    refetch,
  };
};
