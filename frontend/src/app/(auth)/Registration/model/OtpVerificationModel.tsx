import { Form, Input, Modal, Spin } from 'antd'
import { MouseEvent, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';

// import { useVerifyMobile } from '@/app/hooks/userHooks/useVerifyMobile';


interface OtoVerificationModelProps{
    visible:boolean
    onOk: (otp:string)=> void; // Change to function type
    onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void; // Change to function type
    loading: boolean
}

const OtoVerificationModel:React.FC<OtoVerificationModelProps> = ({onCancel, onOk, visible, loading})=>{

    // const { verify, loading:verificationLoading, error} = useVerifyMobile()

    const { control, handleSubmit, formState: { errors }, setValue, watch, setError } = useForm<{otp:string}>({
        defaultValues: {
            otp:''
        },
        mode: 'onChange',
    });

    const otp = watch('otp')

    const onSubmit = (data:{otp:string})=>{
       onOk(otp) 
       
    }

    return(
    <Modal
        title="Verify your mobile"
        open={visible}
        onOk={handleSubmit(onSubmit)}
        onCancel={onCancel}
        okText="Verify"
        closable={false}
        maskClosable={true}
        okButtonProps={{ disabled: (errors['otp']?true:false) || loading, danger:true}}
        cancelButtonProps={{style:{color:'red', borderColor:'red'}}}
    >
    <Spin spinning={loading}>
        
        
        <Form>
            <Form.Item>
            <Controller
                name='otp'
                control={control}
                render={({ field }) => {
                    return (
                        <Input 
                            {...field} 
                            type='OTP' 
                            placeholder='Enter the OTP' 
                        />
                    );
                }}
                rules = {{
                    required: 'OTP required',
                    pattern: { 
                        value: /^[0-9]{6}$/, 
                        message: 'Invalid otp' 
                    },
                }}
            />
            {errors['otp'] && <p style={{fontSize:'14px', color:'rgba(193, 19, 19, 0.509)', paddingTop:'5px'}}>* {errors['otp'].message}</p>}
                      
            </Form.Item>
        </Form>
    </Spin>
        
    </Modal>
)
}

export default OtoVerificationModel