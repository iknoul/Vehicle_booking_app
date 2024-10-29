// modules/vehicle/graph_ql/vehicleType.js
const { gql } = require('apollo-server-express');

const vehicleType = gql`

	scalar Upload

	type Model {
		id: String
		model: String
		type: String
		manufacture: String
	}
	type UserBrief {
		id : String
		name : String
	}

	type Vehicle {
		id: ID!
		name: String!
		model: String!
		manufacture: String!
		type: String!
		image: [String]  # Use [String] if dealing with multiple images
		price: Float
		description: String
		quantity: Int
	}
	type VehicleBrief {
		name: String
	}
	type UniqueVehicleBrief {
		id: String
		vehicle: VehicleBrief
	}
	type PeroidByDateResponse {
		createdDate: String,
        PeriodCount: Int,
        carModel: String,
	}
	type AllPeroidsResponse {
		id : ID
		status: String
		startDate : String
		endDate : String
		uniqueVehicle : UniqueVehicleBrief
		vehicleModelName : String
		vehicleManufacture: String
		vehicleType: String
		user : UserBrief
	}
	type SuccessResponse {
		success: Boolean!
		message: String!
	}

	extend type Query {
		vehicles(model: String, minPrice: Float, maxPrice: Float, startDate: String, endDate: String, limit: Int, filter: Boolean): [Vehicle]
		vehicle(id: ID!): Vehicle
		PeroidByDate: [PeroidByDateResponse]
		allPeriods: [AllPeroidsResponse]
	}

	extend type Mutation {
		createVehicle(
		name: String!, 
		modelId: String,
		image: [Upload!],  # Use [String] for multiple image URLs
		price: Float, 
		description: String, 
		quantity: Int
	): Vehicle
	updateVehicle(
		id: ID!,
		name: String,
		modelId: String,
		image: [Upload],  # Optional to handle multiple images
		price: Float, 
		description: String, 
		quantity: Int
		): SuccessResponse
	deleteVehicle(id: ID!): SuccessResponse
}`;
module.exports = vehicleType;
