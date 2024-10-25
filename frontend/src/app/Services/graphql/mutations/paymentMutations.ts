import { gql } from '@apollo/client';

export const CREATE_PAYMENT_MUTATION = gql`
    mutation CreatePayment($tempPeriodId: String!) {
        createPayment(tempPeriodId: $tempPeriodId) {
            orderId
            amount
        }
    }
`;

export const VERIFY_PAYMENT_MUTATION = gql`
    mutation VerifyPayment($orderId: String!, $paymentId: String!, $signature: String!, $tempPeriodId: String!) {
        verifyPayment(orderId: $orderId, paymentId: $paymentId, signature: $signature, tempPeriodId: $tempPeriodId) {
            success
            
        }
    }
`;
// message
