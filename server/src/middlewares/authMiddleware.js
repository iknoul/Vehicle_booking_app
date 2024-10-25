
const jwt = require('./../services/jwt-servise')


// This Set will store blacklisted tokens
const blacklistedTokens = new Set();

/**
 * Middleware to handle JWT token verification and blacklisting
 */
const verifyToken = async ({ req }) => {
    const authHeader = req.headers.authorization;
    // Check if the request is to the GraphQL endpoint and the operation is login or register
    const { body: { operationName } } = req;
    console.log(operationName, 'here the operation names')
    const isPublicQuery = operationName === 'Vehicles'; // Add more public queries as needed
    const isLoginOrRegister = operationName === 'Login' || operationName === 'register';

    // Skip authentication for login and registration
    if (isLoginOrRegister || isPublicQuery) {
        return {}; // Return empty context for login and register operations
    }

    // If there is an Authorization header, verify the token
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Extract the Bearer token
        
        // Check if the token is blacklisted
        if (blacklistedTokens.has(token)) {
            throw new Error('Forbidden: Token is blacklisted.'); // Throw an error for blacklisted token
        }

        try {
            const user = jwt.verifyToken(token); // Verify the token
            return { user }; // Return user info to be used in resolvers
        } catch (error) {
            console.error('Token verification failed:', error);
            throw new Error('Forbidden: Invalid token.'); // Throw an error for invalid token
        }
    } else {
        throw new Error('Unauthorized: No token provided.'); // No token provided
    }
};

/**
 * Function to blacklist a token
 * @param {string} token - The JWT token to be blacklisted
 */
const blacklistToken = (token) => {
    blacklistedTokens.add(token);
    console.log('Token blacklisted:', token);
};

/**
 * Function to remove a token from the blacklist
 * @param {string} token - The JWT token to be removed from the blacklist
 */
const removeFromBlacklist = (token) => {
    blacklistedTokens.delete(token);
    console.log('Token removed from blacklist:', token);
};

module.exports = {
    verifyToken,
    blacklistToken,
    removeFromBlacklist
};
