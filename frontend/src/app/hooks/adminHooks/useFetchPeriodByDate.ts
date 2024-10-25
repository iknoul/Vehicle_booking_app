import { useQuery } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { FETCH_PERIOD_BY_DATE_QUERY } from '../../Services/graphql/queries/periodQuaries';

interface PeroidByDateResponse {
  createdDate: string;
  PeriodCount: number;
  carModel: string;
}
interface UseFetchPeriodByDateOptions {
    enabled?: boolean; // Optional property to control whether to skip the query
}

interface UseFetchPeriodByDateResult {
  periodData: PeroidByDateResponse[] | []; // It can be null if data is not available
  loading: boolean;
  error: any;  // Adjust based on the error type
  refetch: (variables?: any) => void;  // Refetch function
}

export const useFetchPeriodByDate = (options: UseFetchPeriodByDateOptions  = {}): UseFetchPeriodByDateResult => {
  const { loading, error, data, refetch } = useQuery(FETCH_PERIOD_BY_DATE_QUERY, {
    client: apolloClient,
    skip: options.enabled, // Skip query based on the enabled option
  });

  console.log('Fetched period data:', data?.PeroidByDate);

  return {
    loading,
    error,
    periodData: data?.PeroidByDate || null, // Return the period data or null
    refetch,  // Return refetch function
  };
};
