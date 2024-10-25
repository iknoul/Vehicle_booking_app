import { useMutation } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { DELETE_VEHICLE_MODEL_MUTATION } from '../../Services/graphql/mutations/vehicelModelMutation';

interface DeleteResponse {
  success: boolean;
  message: string;
}

export const useDeleteVehicleModel = () => {
  const [deleteVehicleModel, { loading, error }] = useMutation<{ deleteModelRegistry: DeleteResponse }>(DELETE_VEHICLE_MODEL_MUTATION, {
    client: apolloClient,
  });

  const removeVehicleModel = async (id: string) => {
    try {
      const { data } = await deleteVehicleModel({
        variables: { id },
      });

      if (data?.deleteModelRegistry.success) {
        console.log('Vehicle deleted successfully:', data.deleteModelRegistry.message);
        return data.deleteModelRegistry; // Return success response
      } else {
        throw new Error(data?.deleteModelRegistry.message || 'Failed to delete vehicle');
      }
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      throw new Error("Failed to delete vehicle."); // Optional: re-throw a user-friendly error
    }
  };

  return {
    removeVehicleModel,
    loading,
    error,
  };
};
