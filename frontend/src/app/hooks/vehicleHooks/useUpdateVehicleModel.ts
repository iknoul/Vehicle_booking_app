import { useMutation } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { UPDATE_VEHICLE_MODEL_MUTATION } from '../../Services/graphql/mutations/vehicelModelMutation';

interface VehicleModelUpdateData {
  id: string;
  model: string;
  type: string;
  manufacture: string;
  
}

export const useUpdateVehicleModel = () => {
  const [updateModelRegistry, { loading, error }] = useMutation( UPDATE_VEHICLE_MODEL_MUTATION, {
    client: apolloClient,
  });

  const updateExistingVehicleModel = async (vehicleModelData: VehicleModelUpdateData) => {
    try {
      const variables = {
        id: vehicleModelData.id,
        model: vehicleModelData.model,
        manufacture: vehicleModelData.manufacture,
        type : vehicleModelData.type
      };

      const { data } = await updateModelRegistry({ variables });
      return data.updateVehicleModel; // Assuming your GraphQL mutation returns the updated vehicle
    } catch (err) {
      console.error("Error updating vehicle:", err);
      throw new Error("Failed to update vehicle.");
    }
  };

  return {
    updateExistingVehicleModel,
    loading,
    error,
  };
};
