'use client'
import ThrerDImage from './components/ThreeDImage';
import { formatDate } from '@/app/utils/formatDate';
import BookingInputs from './components/BookingInputs';
import PaymentInputs from './components/PaymentInput';
import { useSearchParams } from 'next/navigation'; // Correctly using useRouter
import { useEffect, useState } from 'react';
import { useLockPeriod } from '@/app/hooks/userHooks/useLockPeriod';
import { Button, message, notification, Result } from 'antd';
import PrivateRoute from '@/app/components/PrivateRouter';
import styles from './page.module.css';
import usePayment from '@/app/hooks/userHooks/usePayment';
import { unescape } from 'querystring';
import BookingDetails from './components/BookingDetails';
import { string } from 'three/webgpu';
import LoaderContiner from '@/app/components/LoaderContainer';
import Loader from '@/app/components/Loader';

const key = 'updatable';

const BookingPage: React.FC = () => {
    
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const model = searchParams.get('model')

    const { createLockPeriod, loading:lockLoading, error:lockError } = useLockPeriod();
    const { handlePaymentFlow, success, loading, error, paymentData} = usePayment()

    const [stage, setStage] = useState<'lock' | 'payment' | 'success'>('lock')

    // State to hold the selected dates and location
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [formatedStartDate, setFormatedStartDate] = useState<string | null>(null)
    const [formatedEndDate, setFormatedEndDate] = useState<string | null>(null)
    const [location, setLocation] = useState<string>('Calicut');
    const [lockId, setLockId] = useState<string | undefined>(undefined)
    const [amount, setAmount] = useState<number | undefined>(undefined)
    const [selectedOption, setSelectedOption] = useState<"card" | "upi" | "netbanking">("card")

    // const { paymentData } = usePayment()

    // Get the first element if it's an array, or leave it as is if it's a string
    const vehicleId = Array.isArray(id) ? id[0] : id;
    const vehicleModel = Array.isArray(model) ? model[0] : model;
     


    // Check if id and model are defined
    if (!vehicleId || !vehicleModel) {
        return <div>Invalid vehicle information provided.</div>; // Show an error message if parameters are missing
    }

    const handleLock = async ()=>{
        const formatedStartDate = formatDate(startDate)
        const formatedEndDate = formatDate(endDate)
        setFormatedStartDate(formatedStartDate)
        setFormatedEndDate(formatedEndDate)
        if(formatedStartDate && formatedEndDate){
            try {
                const response = await createLockPeriod({ startDate : formatedStartDate, endDate : formatedEndDate, vehicleId });
                if(response.available){
                    notification.success({
                        message: 'lock success',
                        description: 'Vehicle available on specified dates.',
                    })
                    console.log(response, "here i print the response from ock ")
                    setLockId(response.lockId)
                    setAmount(response.amount)
                    setEndDate(null)
                    setStartDate(null)
                    setStage('payment')
                    return;
                }
                notification.info({
                    message: 'Not available',
                    description: 'Vehicle not available on specified dates.',
                });
                
                console.log("Lock Period Response:", response);
                // Handle successful response (e.g., show a message, redirect, etc.)
            } catch (error) {
                message.error({ content: `Login Failed \n${error}`, key, duration: 2 });
                console.error("Error occurred:", error);
                // Handle error (e.g., show error message)
            }
       }
    }
    const handlePayment = async(tempPeriodId: string, payType:string ) =>{
        try {
            await handlePaymentFlow(tempPeriodId, payType);
            
        } catch (err) {
            
        }
    }
    const handleCancel = async () =>{
        //add temp period deletion hook
        setStage('lock')
    }

    useEffect(()=>{
        if (success) {
            notification.success({
                message: 'Payment Success',
                description: 'Your payment has been successfully verified.',
            });
            setStage('success');
        }  
        else if(error){
            notification.error({
                message: 'Payment Error',
                description: error || 'There was an issue with the payment.',
            });
            message.destroy()
        } 
    },[loading])
   
    useEffect(()=>{}, [stage])
    if(stage !== 'success'){
        return ( 
            <PrivateRoute>
            <LoaderContiner isLoading={loading || lockLoading} spinner={<Loader/>}>
            <div className={styles.bookingPage} style={{ height: '100vh', width: '100%' }}>
                <div className={styles.threeDImageContainer}>
                    <ThrerDImage />
                </div>
                {stage === 'lock' && 
                    <BookingInputs 
                        id={vehicleId} model={vehicleModel} 
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        location={location}
                        setLocation={setLocation}
                        endDate={endDate}
                        startDate={startDate}
                        handleSubmit={handleLock}
                    />
                }
                {stage === 'payment' && lockId &&
                    <PaymentInputs 
                        tempPeriodId={lockId} 
                        model={vehicleModel} 
                        location={location}
                        endDate={formatedEndDate}
                        startDate={formatedStartDate}
                        setStage={setStage}
                        handlePayment={handlePayment}
                        handleCancel={handleCancel}
                        amount={amount}
                    />
                }
            </div>
            </LoaderContiner>
            </PrivateRoute>
        );
    }
    return (
        <BookingDetails 
            startDate={formatedStartDate} 
            endDate={formatedEndDate} model={model} 
            paymentData={paymentData}
            amount={amount}
        />
    )   
};

export default BookingPage;
