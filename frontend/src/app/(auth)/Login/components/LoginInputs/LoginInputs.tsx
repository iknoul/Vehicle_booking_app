'use client'
import { Button, message, Spin } from 'antd'
import { useState } from 'react'
import { useLogin } from '@/app/hooks/authHooks/useLogin'
import { useAuth } from '@/app/hooks/authHooks/useAuth'
import {delay} from '@/app/utils/addDelay'

import styles from './loginInputs.module.css'
import { useRouter } from 'next/navigation'


const MobileRegex = /[0-9]{10}/
const PasswordReagex = /[[a-zA-Z0-9.$*@_%+-]{6}/

const LoginInputs:React.FC = ()=>{

    const router = useRouter()
    const {verifyOtp, loading, error:logInError} = useLogin()
    const key = 'updatable';

    const [password, setPassword] = useState<string>('')
    const [mobile, setMobile ] = useState<string>('')
    const [error, setError] = useState<{password:string, mobile:string}>({password:'', mobile: ''})
    const [load, setLoad] = useState(Boolean)


    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
        if (type === 'password') {
            
            setPassword(event.target.value);
        }
        else if(type == 'mobile'){
            setMobile(event.target.value)
        }

        setError(prevState => ({
            ...prevState,
            [`${type}`]: ''
        }));
    };

    const handleSubmit = async ()=>{
        if (mobile == null || !MobileRegex.test(mobile)) {
            setError(prevState => ({
                ...prevState,
                mobile: 'Valid mobile required'
            }));
        }
        else if(password == null || !PasswordReagex.test(password)){
            setError(prevState => ({
                ...prevState,
                password: 'Valid password required'
            }));
        }
        else{
          try {
            setLoad(true)
            message.loading({content: 'logging in...', key})

            await delay(2000)
            await verifyOtp(mobile, password)
            message.success({ content: 'Succesfully logged In!', key, duration: 1 })
            await delay(1000)
            router.push('/')

          } catch (error) {
            message.error({ content: 'Login Failed', key, duration: 2 });
          }
          setLoad(false)
        }
    }

    return(
    <Spin spinning={load} indicator={<></>}>
    <div className={styles.loginInputs}>

        <h1>Sign-in</h1>
        <div className={styles.inputs}>
            <input type="text" placeholder='Mobile' onChange={(e)=>{handleOnChange(e, 'mobile')}}/>
            {error.mobile &&
                <p className={styles.error}>* {error.mobile}</p>
            }
            <input type="password" placeholder='Password' onChange={(e)=>{handleOnChange(e, 'password')}}/>
            {error.password &&
                <p className={styles.error}>* {error.password}</p>
            }
        </div>
        <div className={styles.inputs}>
            <Button block onClick={handleSubmit}>Login</Button>
            <p>Don't have an account? &nbsp;<a href="Registration">Sign up</a> Here</p>
        </div>
    </div>
    </Spin>
    )
}

export default LoginInputs