'use client'
import { Form, Input, Spin, Button, Upload, Alert, Select } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { RcFile } from 'antd/es/upload/interface'; // Import RcFile from Ant Design
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { useCreateUser } from '@/app/hooks/userHooks/useCreateUser';
import { useFetchAdress } from '@/app/hooks/userHooks/useFetchAdress';
import styles from './registrationInputs.module.css';

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
  profilePic: File; // The profilePic will store the Base64 string
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
}

const PersonalData: React.FC<PersonalDataProps> = ({ setRegistrationStage, setData }) => {
  const { Option } = Select;
  const { control, handleSubmit, formState: { errors }, setValue, watch, setError } = useForm<FormValues>({
    defaultValues: {
      name: '',
      pinCode: '',
      city: '',
      profilePic: undefined,
    },
    mode: 'onChange',
  });

  const pinCode = watch('pinCode');
  const profilePic = watch('profilePic');
  const city = watch('city');

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [status, setStatus] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { createNewUser, loading } = useCreateUser();
  const { adress, refetch } = useFetchAdress(pinCode);

  const handlePinCodeChange = async () => {
    if (pinCode && /^[0-9]{6}$/.test(pinCode)) {
      const result = await refetch();
      alert('pincode fetch');
    }
  };

  useEffect(() => {
    handlePinCodeChange();
  }, [pinCode]);

  const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    console.log(newFileList,"here the fle")
    const updatedFileList = newFileList.map(file => ({
      ...file,
      uid: file.uid ?? Date.now().toString(),
      lastModifiedDate: file.lastModifiedDate ?? new Date(),
    } as UploadFile));

    setFileList(updatedFileList);

    // Convert the file to Base64 and update the form's profilePic field
    if (updatedFileList.length > 0) {
      const file = updatedFileList[0].originFileObj as RcFile;
      const base64 = await getBase64(file);
      setValue('profilePic', file); // Set the base64 string for profilePic
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!profilePic) {
      setError('profilePic', { type: 'manual', message: 'Profile picture is required' });
      return;
    }

    console.log('Form Submitted:', data);
    setRegistrationStage('personalData');
    setData({ ...data });
  };

  return (
    <div className={styles.registrationInputs}>
      {alertMessage && <Alert message={alertMessage} type={status ? 'success' : 'error'} showIcon />}
      <h1>Sign-Up</h1>
      <Spin tip="Loading" spinning={loading}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.form}>
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
                  <Select {...field} placeholder="Select city" value={field.value || undefined}>
                    {adress?.City?.map((item, index) => (
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
              rules={{ required: 'Profile picture is required' }}
              render={({ field }) => (
                <Upload
                  {...field}
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleChange}
                  beforeUpload={() => false}
                >
                  {fileList.length >= 1 ? null : <UploadOutlined />}
                </Upload>
              )}
            />
            {errors.profilePic && <p className={styles.err}>* {errors.profilePic.message}</p>}
          </Form.Item>
          <Form.Item className={styles.buttonContainer}>
            <Button htmlType="submit" style={{ backgroundColor: 'rgba(32, 29, 72, 0.897)', color: 'white' }}>
              Next
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default PersonalData;