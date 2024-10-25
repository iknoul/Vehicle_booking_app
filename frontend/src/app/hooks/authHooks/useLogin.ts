import { useMutation } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { LOGIN_MUTATION } from '../../Services/graphql/mutations/loginMutation'; // Adjust the import to your mutation
import { useAuth } from './useAuth';

interface UseLoginResult {
    loading: boolean;
    error: any; // More specific error type if you want
    verifyOtp: (mobile: string, password: string) => Promise<any>; // Function to call the mutation
}

export const useLogin = (): UseLoginResult => {
    const { login:setLoggedIn, isAuthenticated} = useAuth()

    const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION, {
        client: apolloClient,
        onError: (err) => {
            console.error('Error during login:', err);
        }
    });
    const verifyOtp = async (mobile: string, password: string) => {
        try {
            const res = await loginMutation({ variables: { mobile, password } });
            const token = res.data.login.token

           if(res.data.login.success && token){
                login(token)
                return true; // Login succeeded

            } else {
                throw new Error('Login failed: '); // Provide a more informative error message
            }      
        } catch (error) {
            throw new Error("sorry! ... try again later")
        }
    }

    const login = async (token:string) => {
        try {
            setLoggedIn(token)
        } catch (err) {
            console.error('Error during login process:', err);
            throw err;
        }
    };

     return {
        loading,
        error,
        verifyOtp, // Return the login function
    };
};
