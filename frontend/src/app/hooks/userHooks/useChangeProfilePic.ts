import { useMutation } from '@apollo/client';
import { UPDATE_USER_MUTATION } from '../../Services/graphql/mutations/userMutation';
import apolloClient from '../../../../apollo/apolloClient'; // Adjust the import based on your project structure

export const useChangeProfilePic = () => {
  const [changeProfilePic, { loading, error }] = useMutation(UPDATE_USER_MUTATION,{client: apolloClient,});
  
  const triggerChangeProfilePic = async (profilePic: File) => {
    try {
      const { data } = await changeProfilePic({ variables: { profilePic } });
      return data.changeProfilePic;
    } catch (err) {
      console.error("Error changing profile picture:", err);
      throw new Error("Error changing profile Pic");
    }
  };
  
  return { triggerChangeProfilePic, loading, error };
};
