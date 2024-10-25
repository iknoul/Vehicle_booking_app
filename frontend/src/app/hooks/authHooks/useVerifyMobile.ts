import { useMutation } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { VERIFY_MOBILE_MUTATION } from '../../Services/graphql/mutations/loginMutation';

interface UseVerifyMobileResult {
    token: string | null; // Adjusting type to include null
    loading: boolean;
    error: any; // More specific error type from Apollo Client
    verify: (otp: string, mobile: string) => Promise<void>; // Function to call the mutation
}

export const useVerifyMobile = (): UseVerifyMobileResult => {
    const [verifyMobile, { loading, error, data, reset }] = useMutation(VERIFY_MOBILE_MUTATION, {
        client: apolloClient,
        onError: (err) => {
            console.error('Error verifying mobile:', err);
        }
    });

    const verify = async (mobile:string, otp: string) => {
        try {
            const data = await verifyMobile({ variables: { mobile, otp } });
            console.log(data, 'here also the data')
        } catch (err) {
            console.error('Error during verification:', err);
            throw err

        }
    };

    return {
        loading,
        error,
        token: data?.verifyOtp.token || null, // Adjust this based on your GraphQL response structure
        verify, // Return the verify function
    };
};
