import { useMutation } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { UPDATE_USER_MUTATION } from '../../Services/graphql/mutations/userMutation';

interface FormValues {
  id: string;
  name?: string;
  address?: object;
  pinCode?: string;
  city?: string;
  profilePic?: File;
}

export const useEditUser = () => {
  const [updateUser, { loading, error }] = useMutation(UPDATE_USER_MUTATION, {
    client: apolloClient,
  });

  const editUser = async (userData: FormValues) => {
    try {
      const variables = {
        id: userData.id,
        name: userData.name,
        profilePic: userData.profilePic,
        pinCode: userData.pinCode,
        city: userData.city,
      };
      const { data } = await updateUser({ variables });
      return data.updateUser;
    } catch (err) {
      console.error("Error updating user:", err);
      throw new Error((err as Error).message);
    }
  };

  return { editUser, loading, error };
};
