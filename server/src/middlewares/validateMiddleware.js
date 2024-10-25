
const  { vehicleValidationSchema } = require("./validationSchema")

exports.validateVehicle = (vehicle) => {
  const { error } = vehicleValidationSchema.validate(vehicle);
  if (error) {
    console.log(error)
    throw new Error("validation failed")
  }
}
