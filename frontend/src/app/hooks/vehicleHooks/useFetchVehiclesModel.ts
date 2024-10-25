import { useQuery } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { FETCH_VEHICLES_MODEL_QUERY } from '../../Services/graphql/queries/vehicelModelQuaries';

interface Model {
  id: string;
  model: string;
  type: string;
  manufacture: string;
}

interface UseFetchVehicleModelsResult {
  vehicleModels: Model[];
  loading: boolean;
  error: any;  // Adjust based on the error type
  refetch: () => void;  // Add refetch function to the return type
}

export const useFetchVehicleModels = (): UseFetchVehicleModelsResult => {
  const { loading, error, data, refetch } = useQuery(FETCH_VEHICLES_MODEL_QUERY, {
    client: apolloClient,
  });

  console.log('Fetched vehicles:', data?.vehicles);

  return {
    loading,
    error,
    vehicleModels: data?.modelRegistries || [],
    refetch,  // Return refetch function
  };
};
