import React, { useState } from 'react';
import { Button, Space, message, Upload, Modal } from 'antd';
import { UploadFile } from 'antd/es/upload/interface';
import { useChangeProfilePic } from '@/app/hooks/userHooks/useChangeProfilePic';
import LoaderContainer from '@/app/components/LoaderContainer';
import styles from './changeProfilePic.module.css';

const key = 'updatable';

interface ChangeProfilePicModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ChangeProfilePicModal: React.FC<ChangeProfilePicModalProps> = ({ isOpen, setIsOpen }) => {
  const { triggerChangeProfilePic, loading: changePicLoading } = useChangeProfilePic();

  const [fileList, setFileList] = useState<UploadFile[]>([]); // Correctly typed as UploadFile[]

  const handleProfilePicChange = async () => {
    if (fileList.length === 0) {
      message.error('Please select an image');
      return;
    }

    const file = fileList[0].originFileObj as File; // Extract the File object

    message.loading({ content: "Updating profile picture ...", duration: 0, key });
    try {
      await triggerChangeProfilePic(file);
      message.success({ content: 'Profile picture updated successfully', key });
      setIsOpen(false); // Close the modal after successful update
    } catch (error) {
      console.error(error);
      message.error({ content: 'Failed to update profile picture', key });
    }
  };

  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
    >
      <div className={styles.container}>
        <Space direction="vertical" className={styles.space}>
          <LoaderContainer isLoading={changePicLoading} spinner={<></>}>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false}
            >
              {fileList.length >= 1 ? null : <div>Upload</div>}
            </Upload>
            <Button type="primary" onClick={handleProfilePicChange} className={styles.button}>
              Change Profile Picture
            </Button>
          </LoaderContainer>
        </Space>
      </div>
    </Modal>
  );
};

export default ChangeProfilePicModal;
