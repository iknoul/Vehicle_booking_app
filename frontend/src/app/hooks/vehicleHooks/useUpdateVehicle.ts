import { useMutation } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { UPDATE_VEHICLE_MUTATION } from '../../Services/graphql/mutations/vehicelMutation';

interface VehicleUpdateData {
  id: string;
  name: string;
  description: string;
  model: string;
  price: number;
  quantity: number;
  image: (File | undefined)[]; // Assuming image is an array of strings
}

export const useUpdateVehicle = () => {
  const [updateVehicle, { loading, error }] = useMutation(UPDATE_VEHICLE_MUTATION, {
    client: apolloClient,
  });

  const updateExistingVehicle = async (vehicleData: VehicleUpdateData) => {
    try {
      const variables = {
        id: vehicleData.id,
        name: vehicleData.name,
        description: vehicleData.description,
        price: vehicleData.price,
        quantity: vehicleData.quantity,
        image: vehicleData.image.filter(img => img !== undefined), // Filter out any undefined values
      };

      const { data } = await updateVehicle({ variables });
      return data.updateVehicle; // Assuming your GraphQL mutation returns the updated vehicle
    } catch (err) {
      console.error("Error updating vehicle:", err);
      throw new Error("Failed to update vehicle.");
    }
  };

  return {
    updateExistingVehicle,
    loading,
    error,
  };
};
