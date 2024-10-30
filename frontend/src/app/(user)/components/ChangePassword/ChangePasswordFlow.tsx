import React, { useState } from 'react';
import { Form, Input, Button, Space, message } from 'antd';
import { useSendOtp } from '@/app/hooks/userHooks/useSendOtp';
import { useVerifyOtp } from '@/app/hooks/userHooks/useVerifyOtp';
import ChangePasswordModal from '../../modal/ChangePassword/ChangePasswordModal'; // Import the previously defined ChangePasswordModal
import styles from './changePasswordFlow.module.css'; // Import the styles
import LoaderContiner from '@/app/components/LoaderContainer';

const key = 'updatable'

const ChangePasswordFlow: React.FC = () => {
  const { triggerSendOtp, loading: sendOtpLoading } = useSendOtp();
  const { triggerVerifyOtp, loading: verifyOtpLoading } = useVerifyOtp();
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [token, setToken] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSendOtp = async () => {
    message.loading({content:"sending ...", duration: 0, key})
    try {
      await triggerSendOtp();
      setOtpSent(true);
      message.success({content:'OTP sent successfully', key})
    } catch (error) {
      console.error(error);
      message.error({content:'Failed to send OTP', key})
    }
  };

  const handleVerifyOtp = async (values: { emailOrMobile: string; otp: string }) => {
    message.loading({content:"sending ...", duration: 0, key})
    try {
      const token = await triggerVerifyOtp(values.emailOrMobile, values.otp);
      setToken(token);
      setOtpVerified(true);
      message.success({content:'OTP verified successfully', key})
    } catch (error) {
      console.error(error);
      message.error({content:'Failed to verify OTP,', key})
    }
  };

  const handleChangePasswordClick = () => {
    setIsOpen(true);
  };

  return (
    <div className={styles.container}>
      <Space direction="vertical" className={styles.space}>
      <LoaderContiner isLoading={sendOtpLoading || verifyOtpLoading} spinner={<></>}>
        {!otpSent && (
          <Form layout="vertical" onFinish={handleSendOtp} className={styles.form}>
            
              <Button type="primary" htmlType="submit" loading={sendOtpLoading} className={styles.button}>
                Send OTP
              </Button>
          </Form>
        )}

        {otpSent && !otpVerified && (
          <Form layout="vertical" onFinish={handleVerifyOtp} className={styles.form}>
           
            <Form.Item
              name="otp"
              label="OTP"
              rules={[{ required: true, message: 'Please enter the OTP' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={verifyOtpLoading} className={styles.button}>
                Verify OTP
              </Button>
            </Form.Item>
          </Form>
        )}

        {otpVerified && (
          <Button type="primary" onClick={handleChangePasswordClick} className={styles.button}>
            Change Password
          </Button>
        )}
        <ChangePasswordModal isOpen={isOpen} token={token} setIsOpen={setIsOpen} />
        </LoaderContiner>
      </Space>
    </div>
  );
};

export default ChangePasswordFlow;
