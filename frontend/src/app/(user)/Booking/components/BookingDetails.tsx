import usePayment from "@/app/hooks/userHooks/import { useState } from 'react';"
import { Button, message, Result } from "antd"
import React, { useEffect } from "react"
import styles from './bookingDetails.module.css'
import { useRouter } from "next/navigation"

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
}
interface BookingDetailsProps{
    startDate: string | null
    endDate: string | null 
    model: string | null
    paymentData: RazorpayResponse | undefined
    amount : number | undefined
}

const BookingDetails:React.FC<BookingDetailsProps> = ({startDate, endDate, model, paymentData, amount}) => {
    const router = useRouter()
    let subTitle = (
        <span className={styles.span}>
            <h3>Amount: ${amount}</h3>
            <h3>Start date: {startDate}</h3>
            <h3>End date: {endDate}</h3>
            <h3>orderId: {paymentData?.razorpay_order_id}</h3>
            <h3>paymentId: {paymentData?.razorpay_payment_id}</h3>

        </span>
    )

    const handleOk = ()=>{
        router.push('/')
    }
    // useEffect(()=>{
    //     if(success){
    //         subTitle = (
    //             <span style={{display:'flex', flexDirection:'column'}}>
    //                 <p>orderId: {paymentData?.razorpay_order_id} paymentId: {paymentData?.razorpay_payment_id}</p>
    //                 <p>Start date: {startDate} End date: {endDate}</p>
    //             </span>
    //         )
    //     }
    //     console.log(paymentData, loading, success, startDate, endDate, 'paymentData, loading, success, startDate, endDate')
    // }, [loading, success])

    // if(loading){
    //     message.loading({content:'Please wait ...', duration:Infinity})
    //     return<></>
    // }

    return(
        <div className={styles.bookingDetailsContainer}>
            <Result
                className={styles.details}
                status="success"
                title={`Successfully Booked ${model}!`}
                subTitle={subTitle}
                extra={[
                <Button className={styles.button} onClick={handleOk} key="Go home">
                    Ok
                </Button>,
                ]}
            />
        </div>
    )
}
export default BookingDetails