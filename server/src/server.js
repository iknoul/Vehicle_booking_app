const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const sequelize = require('../config/database'); // Ensure correct path

const { GraphQLUpload, graphqlUploadExpress } = require('graphql-upload');

const baseSchema = require('./baseSchema'); // Import the base schema
const userType = require('./modules/users/graph_ql/types/userType');
const userResolvers = require('./modules/users/graph_ql/resolvers/userResolvers');
const vehicelType = require('./modules/vehicle/graph_ql/types/vehicleType')
const authType = require('./modules/auth/graph_ql/types/authType')
const authResolvers = require('./modules/auth/graph_ql/resolvers/authResolvers')
const modelRegistryType = require('./modules/vehicle/graph_ql/types/modelRegistryType')
const vehicelResolvers = require('./modules/vehicle/graph_ql/resolvers/vehicleResolvers')
const modelRegistryResolvers = require('./modules/vehicle/graph_ql/resolvers/modelRegistryResolvers')
const errorDataType = require('./modules/vehicle/graph_ql/types/errorDataType');
const errorDataResolvers = require('./modules/vehicle/graph_ql/resolvers/errorDataResolvers');
const {verifyToken} = require('./middlewares/authMiddleware');
const responseHandler = require('./responseHandler'); // Adjust path as necessary
const CustomError = require('./customError'); // Import the CustomError class
const cleanupJob = require('./services/cleanUpExpiredTimePeriods'); // Import your cron job
const updatePeriodStatus = require('./services/updatePeriodStatusToInHand')
// const seedAdmin = require("./seeds/seedAdmin")

async function startApolloServer() {
  const app = express();
  app.use(express.json());
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

   // Apply authentication middleware
  //  app.use(authMiddleware);

  // Sync the models with the database
  try {
    await sequelize.sync(); // You can pass options here like { force: false }
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Error syncing database:", error);
  }

  // Create ApolloServer instance
  const server = new ApolloServer({
    typeDefs: mergeTypes([baseSchema, userType, vehicelType, modelRegistryType, authType, errorDataType], { all: true }),
    resolvers: mergeResolvers([userResolvers, vehicelResolvers, modelRegistryResolvers, authResolvers, errorDataResolvers]),

    context: async ({ req }) => {
      // Use the authMiddleware to authenticate and return user info
      const auth = await verifyToken({ req });
      return { user: auth.user }; // Pass user info to context
    },
    formatError: (err) => {
      // Check if the error is a CustomError
      console.log('erro hereee ;;;;')
      if (err.originalError instanceof CustomError) {
        // Log the custom error and return a formatted response
        return {
          message: err.message,
          statusCode: err.originalError.statusCode || 500,
        };
      }
      return err; // For other errors, return the default GraphQL error format
    },
    
    
  });

   // Start the Apollo Server before applying middleware
  await server.start();
  // Start the cron job
  cleanupJob; // Simply accessing the module will start the cron job
  updatePeriodStatus;
  // seedAdmin
  server.applyMiddleware({ app });

  // Start the Express server
  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

// Call the async function to start the server
startApolloServer();