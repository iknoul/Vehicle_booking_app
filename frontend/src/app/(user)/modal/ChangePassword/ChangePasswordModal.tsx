import React from 'react';
import { Modal, Form, Input, Button, Spin, message } from 'antd';
import { useChangePassword } from '@/app/hooks/userHooks/useChangePassword';
import styles from './changePasswordModal.module.css'; // Import the styles
import LoaderContiner from '@/app/components/LoaderContainer';

const key = 'updatable'

interface ChangePasswordModalProps {
  isOpen: boolean;
  token: string;
  setIsOpen: (isOpen: boolean) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, token, setIsOpen }) => {
  const { triggerChangePassword, loading } = useChangePassword();

  const handleChangePassword = async (values: { newPassword: string; confirmPassword: string }) => {
    message.loading({content:"changing...", key, duration: 0})
    if (values.newPassword !== values.confirmPassword) {
      message.error({content:'Passwords do not match!', key})
      return;
    }
    try {
      await triggerChangePassword(token, values.newPassword);
      message.success({content:'Password changed successfully', key})
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      message.error({content:'Failed to change password', key})
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
    >
      <LoaderContiner isLoading={loading} spinner={<></>}>
        <Form layout="vertical" onFinish={handleChangePassword} className={styles.form}>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, message: 'Please enter your new password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[{ required: true, message: 'Please confirm your new password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.button}>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </LoaderContiner>
    </Modal>
  );
};

export default ChangePasswordModal;
