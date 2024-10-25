import { useQuery } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { FETCH_PERIODS_QUERY } from '@/app/Services/graphql/queries/periodQuaries';

interface Vehicle {
    id: string;
    name: string;
    model: string;
    manufacture: string
}
interface UniqueVehicle{
    id: string
    vehicle: Vehicle;

}

interface Period {
    id: string;
    status: string
    startDate: string;
    endDate: string;
    uniqueVehicle: UniqueVehicle
}

interface UseFetchPeriodsResult {
    data: Period[] | null;
    loading: boolean;
    error: any;
    refetch: Function;
}

export const useFetchPeriods = (): UseFetchPeriodsResult => {
    const { data, loading, error, refetch } = useQuery<{ periodsByUser: Period[] }>(FETCH_PERIODS_QUERY, {
        client: apolloClient,
        variables: {},
    });

    // If data is undefined or empty, return null for data
    const periodsData = data?.periodsByUser || null;

    return { data: periodsData, loading, error, refetch };
};
