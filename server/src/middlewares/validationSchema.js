const Joi = require('joi')

const base64ImageRegex = /^data:image\/(jpeg|png|gif|bmp|webp);base64,[A-Za-z0-9+/]+={0,2}$/;
exports.vehicleValidationSchema = Joi.object({
	name: Joi.string().required(),
	price: Joi.number().required(),
	modelId: Joi.string().required(),
	// model: Joi.string().required(),
	image: Joi.array().required(),
	quantity: Joi.number().integer().required(),
	description: Joi.string().required(),
	// Add more validations as needed
})
exports.mobileVerificationSchema = Joi.object({
	mobile: Joi.string()
		.pattern(/^\d{10}$/)
		.required()
		.messages({
		'string.pattern.base': 'Mobile number must be a 10-digit number.',
		'any.required': 'Mobile number is required.',
		}),
	password: Joi.string(),
	otp: Joi.string(),
}).xor('password', 'otp'); // Ensures that either password or otp is provided, but not both
