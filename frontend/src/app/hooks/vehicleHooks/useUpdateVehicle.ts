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

const isInt = (str: string): boolean => {
  return /^-?\d+$/.test(str);
};

const containsString = (arr: any[]): boolean => {
  return arr.some(item => typeof item === 'string');
};

export const useUpdateVehicle = () => {
  const [updateVehicle, { loading, error }] = useMutation(UPDATE_VEHICLE_MUTATION, {
    client: apolloClient,
  });

  const updateExistingVehicle = async (vehicleData: VehicleUpdateData) => {
    const priceValue = vehicleData.price.toString();
    const quantityValue = vehicleData.quantity.toString();
    try {
      console.log(vehicleData)
      const variables = {
        id: vehicleData.id,
        modelId: isInt(vehicleData.model) ? vehicleData.model : undefined,
        name: vehicleData.name? vehicleData.name : undefined,
        description: vehicleData.description? vehicleData.description : undefined,
        price: vehicleData.price?  parseFloat(priceValue) : undefined,
        quantity: vehicleData.quantity? parseFloat(quantityValue) : undefined,
        image: containsString(vehicleData.image) ? undefined : vehicleData.image
      };
      console.log(variables, 'here the variables')

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
