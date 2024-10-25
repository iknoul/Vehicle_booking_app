// hooks/useFetchUserProfile.ts
import { useQuery } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient'; // Adjust the import based on your project structure
import { GET_USER_PROFILE_QUERY } from '../../Services/graphql/queries/userQuaries'; // Make sure this path is correct


interface UserProfile {
  id: string,
  name: string,
  profilePic: string,
  email: string,
  mobile: string,
  pinCode: string,
  city: string
}

interface UseFetchUserProfileResult {
  userProfile: UserProfile;
  loading: boolean;
  error: any;  // Adjust based on the error type
  refetch: (variables?: any) => void;  // Add refetch function to the return type
}
export const useFetchUserProfile = (userId: string | undefined) :UseFetchUserProfileResult => {
  // Perform the query
  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE_QUERY, {
    variables: { userId },
    client: apolloClient, // Use the Apollo client
    skip: !userId, // Skip the query if the userId is not provided
  });

  return {
    userProfile: data?.user,
    loading,
    error,
    refetch, // You can use this to refetch the data if needed
  };
};
