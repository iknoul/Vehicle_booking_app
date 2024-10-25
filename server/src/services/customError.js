// // CustomError.ts
// class AccessDenied extends Error {
//     constructor(message) {
//         super(message); // Call the Error constructor with the message
//         this.name = this.constructor.name; // Assign the name of the custom error
//         Error.captureStackTrace(this, this.constructor); // Capture the stack trace
//     }
// }
// CustomError.js
class AccessDenied extends Error {
    constructor(message, statusCode) {
        super(message); // Call the Error constructor with the message
        this.name = this.constructor.name; // Set the error name to the class name
        this.statusCode = statusCode; // Add a statusCode property
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
}

// Export the CustomError class
module.exports = AccessDenied;