import { useState } from 'react';
import { Button, Result } from "antd";
import React from "react";
import styles from './bookingDetails.module.css';
import { useRouter } from "next/navigation";
import { bookingDetailsToPdf } from '@/app/utils/bookinfDetailsToPdf';

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
}
interface BookingDetailsProps {
    startDate: string | null;
    endDate: string | null;
    model: string | null;
    paymentData: RazorpayResponse | undefined;
    amount: number | undefined;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ startDate, endDate, model, paymentData, amount }) => {
    const router = useRouter();

    let subTitle = (
        <span className={styles.span}>
            <h3>Amount: ${amount}</h3>
            <h3>Start date: {startDate}</h3>
            <h3>End date: {endDate}</h3>
            <h3>Order ID: {paymentData?.razorpay_order_id}</h3>
            <h3>Payment ID: {paymentData?.razorpay_payment_id}</h3>
        </span>
    );

    const handleOk = async () => {
        await bookingDetailsToPdf({model, amount, startDate, endDate, paymentData} )
        router.push('/');
    };
    
    return (
        <div className={styles.bookingDetailsContainer}>
            <Result
                className={styles.details}
                status="success"
                title={`Successfully Booked ${model}!`}
                subTitle={subTitle}
                extra={[
                    <Button className={styles.button} onClick={handleOk} key="Go home">
                        Download PDF
                    </Button>,
                ]}
            />
        </div>
    );
};

export default BookingDetails;
