import { useMutation } from '@apollo/client';
import { CHANGE_PASSWORD_MUTATION } from '../../Services/graphql/mutations/userMutation';
import apolloClient from '../../../../apollo/apolloClient'; // Adjust the import based on your project structure

export const useChangePassword = () => {
  const [changePassword, { loading, error }] = useMutation(CHANGE_PASSWORD_MUTATION, {client: apolloClient,});

  const triggerChangePassword = async (token: string, newPassword: string) => {
    console.log(token, newPassword, "here in change")
    try {
      const { data } = await changePassword({ variables: { token, newPassword } });
      return data.changePassword;
    } catch (err) {
      console.error("Error changing password:", err);
      throw new Error("Failed to change password");
    }
  };

  return { triggerChangePassword, loading, error };
};
