'use client'
import { Form, Input, Spin, Button, Upload, Alert, Select } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useCreateUser } from '@/app/hooks/userHooks/useCreateUser';
import {UserDataType} from '../types/UserDataType'

import styles from './registrationInputs.module.css';

interface FormValues {
    email: string;
    mobile: string;
    password: string;
    confirmPassword?: string;
}

const formItems = [
    
    {
        label: 'Email',
        name: 'email' as 'email' | 'mobile' | 'password' | 'confirmPassword',
        type: 'email',
        placeholder: 'Enter your email',
        rules: {
            required: 'Email is required',
            pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid email address',
            },
        },
    },
    
    {
        label: 'Mobile Number',
        name: 'mobile' as 'email' | 'mobile' | 'password' | 'confirmPassword', 
        type: 'tel',
        placeholder: 'Enter your mobile number',
        rules: {
            required: 'Mobile number is required',
            pattern: {
                value: /^[0-9]{10}$/,
                message: 'Invalid mobile number (10 digits required)',
            },
            
        },
    },
    {
        label: 'Password',
        name: 'password' as 'email' | 'mobile' | 'password' | 'confirmPassword', 
        type: 'password',
        placeholder: 'Enter your password',
        rules: {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters long' },
        },
    },
    {
        label: 'Confirm Password',
        name: 'confirmPassword' as 'email' | 'mobile' | 'password' | 'confirmPassword', 
        type: 'password',
        placeholder: 'Confirm your password',
        rules: {
            required: 'Please confirm your password',
            validate: {
                matchesPreviousPassword: (value: string, { password }: FormValues) => 
                    value === password || 'Passwords do not match',
            },
        },
    },
   
];

interface VerificationDetailsProps{
    setRegistrationStage: Function;
    setData: Function;
    handleSendOtp: Function;
    sendingOtp: boolean;
    disabled: boolean;
}

const VerificationDetails: React.FC<VerificationDetailsProps> = ({setRegistrationStage, setData, handleSendOtp, sendingOtp, disabled}) => {

    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
        defaultValues: {
            email: '',
            mobile: '',
            password: '',
            confirmPassword: '',
        },
        mode: 'onChange',
    });

    
    const [alertMessage, setAlertMessage] = useState<string |  null>(null)
    const [status, setStatus] = useState(false)
    const {createNewUser, loading, error} = useCreateUser()

    const onSubmit=(data:FormValues)=>{
        setData((prevState: UserDataType) => {
            // Calculate new state based on prevState
            const newState = { ...prevState, ...data }; // Adjust as needed
            return newState; // Return the new state
        });
        handleSendOtp(data.mobile)
    }
    

    return (
        <div className={styles.registrationInputs}>
            {alertMessage &&
                <Alert message={alertMessage} type={status?'success':'error'} showIcon />
            }
            <h1>Sign-Up</h1>
            <Spin tip="Loading" spinning={loading || sendingOtp}>
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.form} disabled={disabled}>
                    {formItems.map(({ label, name, type, placeholder, rules }) => (
                        <Form.Item label={label} required key={name}>
                            <Controller
                                name={name}
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <Input 
                                            {...field} 
                                            type={type} 
                                            placeholder={placeholder} 
                                        />
                                    );
                                }}
                                rules={rules}
                            />
                            {errors[name] && <p className={styles.err}>* {errors[name].message}</p>}
                        </Form.Item>
                    ))}

                    {/* Submit Button */}
                    <Form.Item className={styles.buttonContainer}>
                        <Button 
                            htmlType="submit"
                            style={{backgroundColor:'rgba(32, 29, 72, 0.897)', color:'white', }}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
};

export default VerificationDetails;
