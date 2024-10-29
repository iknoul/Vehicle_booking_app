'use client'

import { useSendOtp } from '@/app/hooks/authHooks/useSendOtp';
import { useVerifyMobile } from '@/app/hooks/authHooks/useVerifyMobile';
import { useCreateUser } from '@/app/hooks/userHooks/useCreateUser'
import { UserDataType } from './types/UserDataType'
import { lazy, Suspense, useEffect, useState } from 'react';
import { Alert, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/authHooks/useAuth';


const PersonalData = lazy(()=>import('./components/PersonalData'))
const VerificationDetails = lazy(()=> import('./components/VerificationDetails'))
const OtoVerificationModel = lazy(()=> import('./model/OtpVerificationModel'))

const errorMessages = {
    default: 'An unexpected error occurred. Please try again.',
    otpSendFailed: 'Failed to send OTP. Please check your mobile number.',
    AccessDenied: 'Failed to verify OTP. Please check the code and try again.',
    userCreationFailed: 'Failed to create user. Please try again later.',
};


const RegistrationInputs: React.FC = () => {

    const router = useRouter()


    const { sendOtp, loading, error } = useSendOtp();
    const { verify, loading:otpVerificationLoading, error:otpVerificationError, token } = useVerifyMobile()
    const { createNewUser, loading:createUserLoading, error:createUserError} = useCreateUser()
    const { isAuthenticated } = useAuth()


    const key = 'updatable';

    const [data, setData] = useState<UserDataType>()
    const [ isOtpSend, setIsOtpSend] = useState(false)

    const [registrationStage, setRegistrationStage] = useState<undefined | 'personalData' | 'verificationData' | 'otpVerified' | 'completed'>()

    const handleNextStage = ()=>{
    
    }
    const handleSendOtp = async (mobile:string)=>{

        try {
            const response = await sendOtp(mobile)
            setRegistrationStage('verificationData');
            setIsOtpSend(true)
            console.log(response, 'here the response')
        } catch (error) {
            message.error(errorMessages.otpSendFailed);
            console.log(error)
        }   
    }
  
    const handleVerifyOtp = async (otp:string)=>{
        
        // let errorMessage = 'Error creating User!'
        console.log('here i print the profile pic insode the pages', data?.profilePic)

        if(data?.mobile){
            try {
                await verify(data.mobile, otp)
                if(otpVerificationError){
                    
                }
                setRegistrationStage('otpVerified')
                message.loading({ content: 'Creating user...', key });
                if(token){
                    await createNewUser(data, token)
                    setTimeout(()=>{
                        router.push('/Login')
                    }, 2000)
                }
                else{
                    throw new Error('Token is not available for user creation.')
                }
                setRegistrationStage('completed')
                message.success({ content: 'Succesfully registered!', key, duration: 2 });

            } catch (error) {
                const messageContent =
                    error === otpVerificationError
                        ? errorMessages.AccessDenied
                        : errorMessages.userCreationFailed;
                message.error({ content: messageContent, key, duration: 2 });
                
            }
            setIsOtpSend(false)
        }
    }

    const handleCancelOtpVerification = ()=>{
        setIsOtpSend(false)
    }
    const handleSubmit = ()=>{

    }

    useEffect (()=>{if(isAuthenticated) router.push('/')}, [])

    return (
        <Suspense>
            <OtoVerificationModel 
                visible={registrationStage == 'verificationData' && isOtpSend}
                onCancel={handleCancelOtpVerification}
                onOk={handleVerifyOtp}
                loading={otpVerificationLoading}
            />
      
        {!registrationStage &&
            
            <PersonalData setRegistrationStage={setRegistrationStage} setData={setData}/>
            
        }
        {registrationStage &&
            
            <VerificationDetails 
                setRegistrationStage={setRegistrationStage} 
                setData={setData} 
                handleSendOtp={handleSendOtp}
                sendingOtp={loading}
                disabled={registrationStage === 'completed'}/>

        }
        </Suspense>
    );
};

export default RegistrationInputs;
