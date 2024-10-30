import { useMutation } from '@apollo/client';
import { VERIFY_OTP_MUTATION } from '../../Services/graphql/mutations/userMutation';
import apolloClient from '../../../../apollo/apolloClient'; // Adjust the import based on your project structure

export const useVerifyOtp = () => {
  const [verifyOtp, { loading, error }] = useMutation(VERIFY_OTP_MUTATION, {client: apolloClient,});

  const triggerVerifyOtp = async (email: string, otp: string) => {
    try {
      const { data } = await verifyOtp({ variables: { email, otp } });
      console.log(data, "its the data")
      return data.confirmOtp.token;
    } catch (err) {
      console.error("Error verifying OTP:", err);
      throw new Error((err as Error).message);
    }
  };

  return { triggerVerifyOtp, loading, error };
};
