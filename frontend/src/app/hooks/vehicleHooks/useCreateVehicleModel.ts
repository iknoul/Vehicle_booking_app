import { useMutation } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { CREATE_VEHICLE_MODEL_MUTATION} from '../../Services/graphql/mutations/vehicelModelMutation';

interface VehicleModelData {
  model: string;
  manufacture: string;
  type: string;
}

export const useCreateVehicleModel = () => {
  const [createModelRegistry , { loading, error }] = useMutation(CREATE_VEHICLE_MODEL_MUTATION, {
    client: apolloClient,
  });

  const createNewVehicleModel = async (vehicleModelData: VehicleModelData) => {
    try {
      // Ensure image is an array before passing
      console.log(vehicleModelData)
      const variables = {
        model: vehicleModelData.model,
        manufacture: vehicleModelData.manufacture,
        type:  vehicleModelData.type,
      };
      console.log(variables, 'here the variables')
      const { data } = await createModelRegistry({ variables });
      return data.createVehicle; // Assuming your GraphQL mutation returns the created vehicle
    } catch (err) {
      console.error("Error creating vehicle:", err); // Log the error for debugging
      throw new Error("Failed to create vehicle."); // Optional: re-throw a more user-friendly error
    }
  };

  return {
    createNewVehicleModel,
    loading,
    error,
  };
};
