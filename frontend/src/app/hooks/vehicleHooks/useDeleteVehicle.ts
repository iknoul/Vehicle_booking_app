import { useMutation } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { DELETE_VEHICLE_MUTATION } from '../../Services/graphql/mutations/vehicelMutation';

interface DeleteResponse {
  success: boolean;
  message: string;
}

export const useDeleteVehicle = () => {
  const [deleteVehicle, { loading, error }] = useMutation<{ deleteVehicle: DeleteResponse }>(DELETE_VEHICLE_MUTATION, {
    client: apolloClient,
  });

  const removeVehicle = async (id: string) => {
    try {
      const { data } = await deleteVehicle({
        variables: { id },
      });

      if (data?.deleteVehicle.success) {
        console.log('Vehicle deleted successfully:', data.deleteVehicle.message);
        return data.deleteVehicle; // Return success response
      } else {
        throw new Error(data?.deleteVehicle.message || 'Failed to delete vehicle');
      }
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      throw new Error("Failed to delete vehicle."); // Optional: re-throw a user-friendly error
    }
  };

  return {
    removeVehicle,
    loading,
    error,
  };
};
