import { useMutation } from '@apollo/client';
import { LOCK_PERIOD_MUTATION } from '../../Services/graphql/mutations/userMutation';
import apolloClient from '../../../../apollo/apolloClient';

interface LockPeriodData {
  startDate: string; // Expecting ISO format date string
  endDate: string;   // Expecting ISO format date string
  vehicleId: string; // Vehicle ID to lock
}

export const useLockPeriod = () => {
  const [lockPeriod, { loading, error }] = useMutation(LOCK_PERIOD_MUTATION, {
    client: apolloClient,
  });

  const createLockPeriod = async (lockPeriodData: LockPeriodData) => {
    try {
      const variables = {
        startDate: lockPeriodData.startDate,
        endDate: lockPeriodData.endDate,
        vehicleId: lockPeriodData.vehicleId,
      };

      const { data } = await lockPeriod({ variables });
      return data.lockPeriod; // Assuming your GraphQL mutation returns the lock period response
    } catch (err) {
      console.error("Error locking period:", err); // Log the error for debugging
      throw new Error("Failed to lock the period."); // Optional: re-throw a more user-friendly error
    }
  };

  return {
    createLockPeriod,
    loading,
    error,
  };
};
