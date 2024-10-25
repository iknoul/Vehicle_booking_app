const { gql } = require('apollo-server-express');

const userType = gql`

	scalar Upload

	type User {
		id: ID!,
		name: String!, 
		mobile: String,
		email: String,
		profilePic: String,  # Use [String] for multiple image URLs
	}
	type DeleteResponse {
		success: Boolean!
		message: String!
	}
	type Adress {
		State: String,
		Country: String,
		pinCode: String,
		City: [String]
	}
	type LockPeriodResponse {
		available: Boolean !
		lockId: ID
		amount: Int
	}
	type paymentSucces {
		orderId : String
        amount : String
	}
	type RentSuccess {
		success : Boolean !
	}
	type VehicleBrief {
		name: String
	}
	type UniqueVehicleBrief {
		id: String
		vehicle: VehicleBrief
	}
	
	type Period{
		id : ID
		status: String
		startDate : String
		endDate : String
		uniqueVehicle : UniqueVehicleBrief
		vehicleModelName : String
		vehicleManufacture: String
		vehicleType: String
	}

	extend type Query {
		users: [User]
		user(id: ID!): User
		fetchAdress(pinCode: String): Adress
		periodsByUser: [Period]
		doit: String
	}

	extend type Mutation {
		createUser(
			name: String!, 
			mobile: String,
			email: String,
			password: String,
			profilePic: Upload,  # Use [String] for multiple image URLs
			token: String,
		): User
		updateUser(
			name: String!, 
			mobile: String,
			email: String,
			password: String,
			profilePic: [Upload],  # Use [String] for multiple image URLs
		): User
		deleteUser(id: ID!): DeleteResponse 
		lockPeriod(
			startDate: String!
			endDate: String!
			vehicleId: String!
		) : LockPeriodResponse
		createPayment(
			tempPeriodId: String!
		): paymentSucces
		verifyPayment(
			orderId: String 
			paymentId: String 
			signature: String
			tempPeriodId: String
		):RentSuccess
  }`;

module.exports = userType;
// rentVehicle(
// 	lockId: ID!
// ) : RentSuccess