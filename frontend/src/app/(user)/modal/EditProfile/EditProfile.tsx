'use client';
import { Form, Input, Spin, Button, Upload, Modal, Select } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { RcFile } from 'antd/es/upload/interface';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { useCreateUser } from '@/app/hooks/userHooks/useCreateUser';
import { useFetchAdress } from '@/app/hooks/userHooks/useFetchAdress';
import styles from './editProfile.module.css';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface FormValues {
  name: string;
  address?: object;
  pinCode: string;
  city: string;
  profilePic?: string; // Changed to string to hold base64
}

const formItems = [
  {
    label: 'Name',
    name: 'name' as const,
    type: 'text',
    placeholder: 'Enter your name',
    rules: { required: 'Name is required' },
  },
  {
    label: 'Pin code',
    name: 'pinCode' as const,
    type: 'text',
    placeholder: 'Enter your Pin code',
    rules: {
      required: 'Please Enter your pin code',
      pattern: {
        value: /^[0-9]{6}$/,
        message: 'Pin code must be 6 digits long',
      },
    },
  },
];

interface PersonalDataProps {
  setRegistrationStage: Function;
  setData: Function;
  isOpen: boolean;
  setIsOpen: Function;
  userData: FormValues | null; // New prop to receive existing user data
}

const PersonalData: React.FC<PersonalDataProps> = ({
  setRegistrationStage,
  setData,
  isOpen,
  setIsOpen,
  userData,
}) => {
  const { Option } = Select;
  const { control, handleSubmit, formState: { errors }, setValue, watch, setError } = useForm<FormValues>({
    defaultValues: {
      name: '',
      pinCode: '',
      city: '',
      profilePic: '',
    },
    mode: 'onChange',
  });

  const pinCode = watch('pinCode');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { createNewUser, loading } = useCreateUser();
  const { adress, refetch } = useFetchAdress(pinCode);

  useEffect(() => {
    // Populate form with existing user data if available
    if (userData) {
      setValue('name', userData.name);
      setValue('pinCode', userData.pinCode);
      setValue('city', userData.city);
      if (userData.profilePic) {
        setFileList([
          {
            uid: '-1',
            name: 'Profile Image',
            status: 'done',
            url: userData.profilePic, // Assuming profilePic contains the URL
          },
        ]);
      }
    }
  }, [userData, setValue]);

  const handlePinCodeChange = async () => {
    if (pinCode && /^[0-9]{6}$/.test(pinCode)) {
      await refetch();
    }
  };

  useEffect(() => {
    handlePinCodeChange();
  }, [pinCode]);

  const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    const updatedFileList = newFileList.map(file => ({
      ...file,
      uid: file.uid ?? Date.now().toString(),
      lastModifiedDate: file.lastModifiedDate ?? new Date(),
    }));

    setFileList(updatedFileList);

    // Convert the file to Base64 and update the form's profilePic field
    if (updatedFileList.length > 0) {
      const file = updatedFileList[0].originFileObj as RcFile;
      const base64 = await getBase64(file);
      setValue('profilePic', base64); // Store the base64 string for preview or uploading
    }
  };

  const onSubmit = async (data: FormValues) => {
    const updatedFields: Partial<FormValues> = {};

    // Compare each field with original user data
    if (userData?.name !== data.name) {
      updatedFields.name = data.name;
    }
    if (userData?.pinCode !== data.pinCode) {
      updatedFields.pinCode = data.pinCode;
    }
    if (userData?.city !== data.city) {
      updatedFields.city = data.city;
    }
    if (userData?.profilePic !== data.profilePic) {
      updatedFields.profilePic = data.profilePic;
    }

    // Check if there are any fields to update
    if (Object.keys(updatedFields).length === 0) {
      alert('No changes to update');
      return;
    }

    console.log('Updated fields:', updatedFields);
    
    // Perform the update operation here using createNewUser or your specific API call
    try {
      // Assuming you have a function to update the user profile
      // await createNewUser(updatedFields); // Modify this as per your API
      alert('Profile updated successfully');
      setRegistrationStage('personalData');
      setData({ ...data });
      setIsOpen(false); // Close the modal after a successful update
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  return (
    <Modal
      open={isOpen}
      okText="Submit"
      onCancel={() => {
        setIsOpen(false);
      }}
      onOk={() => {
        handleSubmit(onSubmit)();
      }}
      okButtonProps={{ style: { backgroundColor: 'rgba(32, 29, 72, 0.897)', color: 'white' } }}
    >
      <Spin tip="Loading" spinning={loading}>
        <Form layout="vertical" className={styles.form}>
          {formItems.map(({ label, name, type, placeholder, rules }) => (
            <Form.Item label={label} required key={name}>
              <Controller
                name={name}
                control={control}
                render={({ field }) => <Input {...field} type={type} placeholder={placeholder} />}
                rules={rules}
              />
              {errors[name] && <p className={styles.err}>* {errors[name].message}</p>}
            </Form.Item>
          ))}
          {adress && (
            <Form.Item required label="City" key="city">
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Select city">
                    {adress.City.map((item, index) => (
                      <Option key={index} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
                rules={{ required: 'Please select your city' }}
              />
              {errors.city && <p className={styles.err}>* {errors.city.message}</p>}
            </Form.Item>
          )}
          <Form.Item>
            <Controller
              name="profilePic"
              control={control}
              render={({ field }) => (
                <Upload
                  {...field}
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleChange}
                  beforeUpload={() => false} // Prevent automatic upload
                >
                  {fileList.length >= 1 ? null : <UploadOutlined />}
                </Upload>
              )}
            />
            {errors.profilePic && <p className={styles.err}>* {errors.profilePic.message}</p>}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default PersonalData;
