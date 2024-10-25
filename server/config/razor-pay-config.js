const Razorpay = require('razorpay');
require('dotenv').config({ path: './../.env' });


const razorpay = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID, // Your Razorpay Key ID
    key_secret: process.env.RAZOR_PAY_KEY_SECRET // Your Razorpay Secret Key
});

module.exports = razorpay;
