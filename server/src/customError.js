// customError.js
class CustomError extends Error {
    constructor(message, statusCode) {
        // console.log('created error', message, statusCode)
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = CustomError;
