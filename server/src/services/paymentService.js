// paymentService.js
const crypto = require('crypto');
const razorpay = require('../../config/razor-pay-config');
// require('dotenv').config({ path: '../../.env' });
const createOrder = async (amount) => {
    // Create Razorpay order
    const order = await razorpay.orders.create({
        amount: amount * 100, // Convert amount to paise
        currency: 'INR',
        receipt: crypto.randomBytes(10).toString('hex')
    });

    return {
        orderId: order.id,
        amount: order.amount
    };
};

const verifyPayment = (orderId, paymentId, signature) => {
    console.log(process.env.RAZOR_PAY_KEY_SECRET, 'here the verify Payment')
    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZOR_PAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    if (generatedSignature !== signature) {
        throw new Error('Invalid signature');
    }

    return true;
};

module.exports = {
    createOrder,
    verifyPayment
};
