import { useMutation } from '@apollo/client';
import { SEND_OTP_MUTATION } from '../../Services/graphql/mutations/userMutation';
import apolloClient from '../../../../apollo/apolloClient'; // Adjust the import based on your project structure

export const useSendOtp = () => {
  const [sendOtp, { loading, error }] = useMutation(SEND_OTP_MUTATION,{client: apolloClient,});

  const triggerSendOtp = async () => {
    try {
      const { data } = await sendOtp({ variables: { } });
      return data.sendOtp;
    } catch (err) {
      console.error("Error sending OTP:", err);
      throw new Error((err as Error).message);
    }
  };

  return { triggerSendOtp, loading, error };
};
