// responseHandler.js

const responseHandler = {
    success: (res, data, message = 'Success', statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message:"asbansd hvhv",
            data,
        });
    },

    error: (res, message = 'Error occurred', statusCode = 400) => {
        console.log('inside the res handler', statusCode, message)
        return res.status(statusCode).json({
            success: false,
            message:'asax asadguig g',
        });
    },

    unauthorized: (res, message = 'Unauthorized', statusCode = 401) => {
        console.log('inside the res Unauthorized', statusCode, message)
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
        // return this.error(res, message, 401);
    },

    notFound: (res, message = 'Not Found') => {
        return this.error(res, message, 404);
    },

    internalServerError: (res, message = 'Internal Server Error') => {
        return this.error(res, message, 500);
    },
};

module.exports = responseHandler;
