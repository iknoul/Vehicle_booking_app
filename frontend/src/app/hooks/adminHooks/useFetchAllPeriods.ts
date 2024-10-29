import { useQuery } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { FETCH_ALL_PERIODS_QUERY } from '@/app/Services/graphql/queries/periodQuaries';

interface Vehicle {
  id: string;
  name: string;
}

interface UniqueVehicle {
  id: string;
  vehicle: Vehicle;
}

interface User {
  id: string;
  name: string;
}

interface Period {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  uniqueVehicle: UniqueVehicle;
  user: User;
  vehicleModelName: string;
  vehicleManufacture: string;
  vehicleType: string | null;
}

interface UseFetchAllPeriodsResult {
  data: Period[] | undefined;
  loading: boolean;
  error: any;
  refetch: () => void;
}

export const useFetchAllPeriods = (): UseFetchAllPeriodsResult => {
  const { data, loading, error, refetch } = useQuery<{ allPeriods: Period[] }>(FETCH_ALL_PERIODS_QUERY, {
    client: apolloClient,
  });

  const periodsData = data?.allPeriods || [];
  return { data: periodsData, loading, error, refetch };
};
