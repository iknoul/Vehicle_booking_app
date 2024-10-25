import { useMutation } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient'; // Adjust the import based on your project structure
import { CREATE_USER_MUTATION } from '../../Services/graphql/mutations/userMutation'; // Make sure this path is correct
import { UserDataType } from '@/app/(auth)/Registration/types/UserDataType';

export const useCreateUser = () => {
  const [createUser, { loading, error }] = useMutation(CREATE_USER_MUTATION, {
    client: apolloClient,
  });

  const createNewUser = async (userData: UserDataType, token:string) => {
    try {
      // Prepare variables for mutation
      const variables = {
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        password: userData.password,
        profilePic: userData.profilePic, // Filter out undefined values
        token
      };
      alert('i say error in create user mutaion')
      const { data } = await createUser({ variables });
      alert('you wrong!')

      return data.createUser; // Assuming your GraphQL mutation returns the created user
    } catch (err) {
      console.error("Error creating user:", err); // Log the error for debugging
      const errorMessage = (err as Error).message;
      throw new Error(errorMessage ); // Optional: re-throw a more user-friendly error
    }
  };

  return {
    createNewUser,
    loading,
    error,
  };
};
