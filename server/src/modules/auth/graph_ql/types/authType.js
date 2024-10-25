const { gql } = require('apollo-server-express');

const userType = gql`
	type SuccessResponse {
		success: Boolean!
		message: String!
		token: String
	}
	extend type Mutation {
		sendOtp(mobile: String): SuccessResponse
		verifyOtp(otp: String, mobile: String): SuccessResponse
		login(mobile: String, password: String): SuccessResponse
	}`;
module.exports = userType;
