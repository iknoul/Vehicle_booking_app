import { useMutation } from '@apollo/client';
import apolloClient from '../../../../apollo/apolloClient';
import { SEND_OTP_MUTATION } from '../../Services/graphql/mutations/loginMutation'; // Adjust the import as needed

interface UseSendOtpResult {
    loading: boolean;
    error: any; // Specific error type
    sendOtp: (mobile: string) => Promise<any>; // Function to call the mutation
}

export const useSendOtp = (): UseSendOtpResult => {
    const [sendOtpMutation, { loading, error }] = useMutation(SEND_OTP_MUTATION, {
        client: apolloClient,
        onError: (err) => {
            console.error('Error sending OTP:', err);
        }
    });

    const sendOtp = async (mobile: string) => {
        try {
            const res = await sendOtpMutation({ variables: { mobile } });
            return res?.data?.sendOtp
        } catch (err) {
            console.error('Error during OTP sending:', err);
            throw err
        }
    };

    return {
        loading,
        error,
        sendOtp, // Return the sendOtp function
    };
};
