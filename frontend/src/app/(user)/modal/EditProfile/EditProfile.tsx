'use client';
import { Form, Input, Spin, Button, Modal, Select } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useEditUser } from '@/app/hooks/userHooks/useEditUser';
import { useFetchAdress } from '@/app/hooks/userHooks/useFetchAdress';
import styles from './editProfile.module.css';

interface FormValues {
  id: string;
  name: string;
  address?: object;
  pinCode: string;
  city: string;
}

const formItems = [
  { label: 'Name', name: 'name' as const, type: 'text', placeholder: 'Enter your name', rules: { required: 'Name is required' } },
  { label: 'Pin code', name: 'pinCode' as const, type: 'text', placeholder: 'Enter your Pin code', rules: { required: 'Please enter your pin code', pattern: { value: /^[0-9]{6}$/, message: 'Pin code must be 6 digits long' } } },
];

interface PersonalDataProps {
  setIsOpen: Function;
  isOpen: boolean;
  userData: FormValues;
}

const PersonalData: React.FC<PersonalDataProps> = ({ setIsOpen, isOpen, userData }) => {
  const { Option } = Select;
  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    defaultValues: { name: '', pinCode: '', city: '' },
    mode: 'onChange',
  });

  const pinCode = watch('pinCode');
  const { editUser, loading } = useEditUser();
  const { address, refetch } = useFetchAdress(pinCode);

  useEffect(() => {
    if (userData) {
      setValue('name', userData.name);
      setValue('pinCode', userData.pinCode);
      setValue('city', userData.city);
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

  const onSubmit = async (data: FormValues) => {
    const updatedFields: Partial<FormValues> = {};
    if(userData.id){
      if(!userData?.id) {alert("something went wrong"); return}
      if (userData?.name !== data.name) updatedFields.name = data.name;
      if (userData?.pinCode !== data.pinCode) updatedFields.pinCode = data.pinCode;
      if (userData?.city !== data.city) updatedFields.city = data.city;

      if (Object.keys(updatedFields).length === 0) {
        alert('No changes to update');
        return;
      }

      try {
        await editUser({...updatedFields, id:userData.id});
        alert('Profile updated successfully');
        setIsOpen(false);
      } catch (error) {
        console.error(error);
        alert('Failed to update profile');
      }
    }
  };

  return (
    <Modal
      open={isOpen}
      okText="Submit"
      onCancel={() => setIsOpen(false)}
      onOk={() => handleSubmit(onSubmit)()}
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
              {errors[name] && <p className={styles.errorText}>* {errors[name].message}</p>}
            </Form.Item>
          ))}
          {address && (
            <Form.Item required label="City" key="city">
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Select city">
                    {address.City.map((item, index) => (
                      <Option key={index} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
                rules={{ required: 'Please select your city' }}
              />
              {errors.city && <p className={styles.errorText}>* {errors.city.message}</p>}
            </Form.Item>
          )}
        </Form>
      </Spin>
    </Modal>
  );
};

export default PersonalData;
