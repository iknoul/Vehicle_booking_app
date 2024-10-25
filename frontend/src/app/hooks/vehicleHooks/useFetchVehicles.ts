import { useQuery } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { FETCH_VEHICLES_QUERY } from '../../Services/graphql/queries/vehicelQueries';

interface VehicleModel {
  id: string;
  model: string;
  manufacture: string;
  type: string;
}

interface Vehicle {
  id: string;
  name: string;
  key: string;
  image: string[];
  description: string;
  price: number;
  quantity: number;
  // vehicleModel: VehicleModel;
  model: string
  manufacture: string
  type: string
// Add other properties of a vehicle
}

interface UseFetchVehiclesResult {
  vehicles: Vehicle[];
  loading: boolean;
  error: any;  // Adjust based on the error type
  refetch: (variables?: any) => void;  // Add refetch function to the return type
}

interface UseFetchVehiclesParams {
  searchQuery?: string;
  startDate?: string; 
  endDate?:string;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  filter?: boolean
}

interface UseFetchVehiclesOptions {
  enabled?: boolean;
}

export const useFetchVehicles = (filters?: UseFetchVehiclesParams, options: UseFetchVehiclesOptions = {}
): UseFetchVehiclesResult => {
  console.log(filters, "her the filters")
  const { loading, error, data, refetch } = useQuery(FETCH_VEHICLES_QUERY, {
    client: apolloClient,
    variables: {
      model: filters?.searchQuery,
      type: filters?.searchQuery,
      limit: filters?.limit,
      startDate: filters?.startDate,
      endDate: filters?.endDate,
      minPrice: filters?.minPrice,
      maxPrice: filters?.maxPrice,
      filter: filters?.filter
    },
    skip: options.enabled
  });

  console.log('Fetched vehicles:', data?.vehicles);

  return {
    loading,
    error,
    vehicles: data?.vehicles || [],
    refetch,  // Return refetch function
  };
};
