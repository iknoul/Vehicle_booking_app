'use client'
import { Button, message, notification } from 'antd';
import styles from './bookingInputs.module.css'
import usePayment from '@/app/hooks/userHooks/usePayment';
import { useEffect } from 'react';

const key = 'updatable';

interface PaymentInputsProps{
    tempPeriodId:string,
    model?: string,
    startDate: string | null,
    endDate: string | null,
    location: string,
    setStage: Function
    handlePayment: (tempPeriodId:string, payType: "card" | "upi" | "netbanking")=>{}
    handleCancel: Function
    amount?: number
}
const  PaymentInputs:React.FC<PaymentInputsProps> = ({tempPeriodId, model, startDate, endDate, location, setStage, handlePayment, amount, handleCancel}) =>{

    const onPaymentClick = async (payType: "card" | "upi" | "netbanking") => {
        handlePayment(tempPeriodId, payType)
    };
    const onCancelClick = async () => {
        handleCancel(tempPeriodId)
    }
    
    return(
        <div className={styles.bookingInputsContainer}>
        <div className={styles.bookInputHead}>
            <h2 className={styles.amount}>$ {amount}</h2>
            <h3>Rent the {model}</h3>
            <h4>From: {startDate}</h4>
            <h4>To: {endDate}</h4>
            <h4>Location: {location}</h4>
        </div>
        <button className={styles.pay} onClick={()=>onPaymentClick('upi')}>
            Pay via UPI
        </button>
        <button className={styles.pay} onClick={()=>onPaymentClick('card')}>
            Pay via Debit Card
        </button>
        <button className={styles.pay} onClick={()=>onPaymentClick('netbanking')}>
            Pay via Net Banking
        </button>
        <button className={`${styles.cancel} ${styles.pay}`} onClick={onCancelClick}>
            Cancel
        </button>
      </div>
    )
}

export default PaymentInputs