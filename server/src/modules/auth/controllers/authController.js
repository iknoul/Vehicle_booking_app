// modules/User/controllers/UserController.js

const twilio = require('../../../../utils/twilio')
const otpService = require('./../../../services/otpService')
const jwt = require('./../../../services/jwt-servise')
const bcrypt = require('bcrypt');

const User = require('./../../users/schema/userModel')
// const Admin = require('./../../admin/')

//Fetch addrss details from pinCode
const sentOtp = async(mobile) =>{
  try {
		const otp = otpService.generateOTP(mobile);
		console.log(otp, "thid is otp",mobile)
		// await twilio.sendSms(mobile, otp)
		return {success: true, message:"Otp send Succesfully"}
	} catch (error) {
    	throw new Error('Error in sending OTP')
  }
}

const verifyOtp = async(mobile, otp) =>{
  try {
		otpService.verifyOTP(mobile, otp);
    	const loginToken = jwt.createToken({ mobile, stage:'otpVerified',})
		return {success: true, message:"Otp send Succesfully", token: loginToken}
	} catch (error) {
    // throw error
  }
}

const logIn = async (mobile, password) => {
	try {
		// Find the user by mobile
		console.log(mobile, 'here i print the mobile number')
		const user = await User.findOne({ where: { mobile } });
		if (!user) {
		return { success: false, message: 'User not found' };
		}

		// Check if the password matches
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
		return { success: false, message: 'Invalid password' };
		}

		// Create a token
		const loginToken = jwt.createToken({ mobile, stage: 'loggedIn', id:user.id });
		return { success: true, message: 'Login successful', token: loginToken };
	} catch (error) {
		return { success: false, message: error.message };
	}
};

const logOut = (req, res) => {
  // Invalidate the token on the client-side
  // You can also implement a token blacklist strategy if needed
  return { success: true, message: 'Logged out successfully' };
};

module.exports = {
  sentOtp,
  verifyOtp,
  logIn,
  logOut
};
