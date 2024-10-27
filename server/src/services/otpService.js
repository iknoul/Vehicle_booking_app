const crypto = require('crypto');
const AccessDenied = require('./customError')

const otps = {}; // Temporary in-memory store

exports.generateOTP = (mobile) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    otps[mobile] = { otp, expires: Date.now() + 300000 }; // OTP expires in 5 minutes
    return otp;
};

exports.verifyOTP = (mobile, otp) => {
    
    console.log(otp, otps)
    if (!otps[mobile]) {
        throw new AccessDenied('Access  denied');
    }
    if (otps[mobile].expires < Date.now()) {
        delete otps[email];
        throw new AccessDenied('Expired OTP');
    }
    if (otps[mobile].otp == otp) {
        delete otps[mobile];
        return true;
    }
    throw new AccessDenied('Access  denied');
};
