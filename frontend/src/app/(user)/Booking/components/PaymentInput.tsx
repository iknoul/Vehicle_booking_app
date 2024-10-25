'use client'
import { Button, message, notification } from 'antd';
import styles from './bookingInputs.module.css'
import usePayment from '@/app/hooks/userHooks/usePayment';
import { useEffect } from 'react';

const key = 'updatable';

interface PaymentInputsProps{
    tempPeriodId:string,
    model?: string,
    startDate: Date | null,
    endDate: Date | null,
    location: string,
    setStage: Function
    handlePayment: Function
    amount?: number
}
const  PaymentInputs:React.FC<PaymentInputsProps> = ({tempPeriodId, model, startDate, endDate, location, setStage, handlePayment, amount}) =>{

    const onPaymentClick = async () => {
        handlePayment(tempPeriodId)
    };
    
    return(
    <div className={styles.bookingInputsContainer}>
        <div className={styles.bookInputHead}>
            <h3>Rent the {model}</h3>
            <h2></h2>
        </div>
        
        <h2>payment page</h2>

        <Button className={styles.pay} color='danger' onClick={onPaymentClick}>
            Pay {amount}
        </Button>
    </div>)
}

export default PaymentInputs