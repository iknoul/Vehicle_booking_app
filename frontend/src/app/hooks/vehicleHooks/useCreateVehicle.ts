import { useMutation } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { CREATE_VEHICLE_MUTATION } from '../../Services/graphql/mutations/vehicelMutation';


interface VehicleData {
  name: string;
  description: string;
  model: string;
  price: number;
  quantity: number;
  image: (File | undefined)[]; // Assuming image is an array of strings
}

export const useCreateVehicle = () => {
  const [createVehicle, { loading, error }] = useMutation(CREATE_VEHICLE_MUTATION, {
    client: apolloClient,
  });

  const createNewVehicle = async (vehicleData: VehicleData) => {

    const priceValue = vehicleData.price.toString();
    const quantityValue = vehicleData.quantity.toString();
    try {
      // Ensure image is an array before passing
      console.log(vehicleData)
      // const x = vehicleData.image.filter(img => img !== undefined)
      const variables = {
        name: vehicleData.name,
        modelId: vehicleData.model,
        description: vehicleData.description,
        price: parseFloat(priceValue), // Ensures price is a number
        quantity: parseFloat(quantityValue), // Ensures quantity is an integer
        // price: vehicleData.price,
        // quantity: vehicleData.quantity,
        // quantity: parseInt('2'),
        // image: vehicleData.image.filter(img => img !== undefined), // Filter out any undefined values
        image: vehicleData.image,
      };
      console.log(variables, 'here the variables')
      const { data } = await createVehicle({ variables });
      return data.createVehicle; // Assuming your GraphQL mutation returns the created vehicle
    } catch (err) {
      console.error("Error creating vehicle:", err); // Log the error for debugging
      throw new Error("Failed to create vehicle."); // Optional: re-throw a more user-friendly error
    }
  };

  return {
    createNewVehicle,
    loading,
    error,
  };
};
