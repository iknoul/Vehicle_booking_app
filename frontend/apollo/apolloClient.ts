// // apolloClient.js
// import { ApolloClient, InMemoryCache } from '@apollo/client';
// import  createUploadLink  from 'apollo-upload-client/createUploadLink.mjs';

// const client = new ApolloClient({
//   link: createUploadLink({uri: 'http://localhost:4000/graphql'}), // Replace with your GraphQL server URL
//   cache: new InMemoryCache(), // Apollo's built-in caching mechanism
// });

// export default client;
// apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

// Create the upload link
const uploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql', // Replace with your GraphQL server URL
});

// Use setContext to add the Authorization header to each request
const authLink = setContext((_, { headers }) => {
  // Retrieve the token from localStorage or any secure storage
  const token = sessionStorage.getItem('token'); // Adjust this according to your token storage

  // Return the headers including the Authorization token
  return {
    headers: {
      ...headers, // Spread the existing headers, so they are not overwritten
      Authorization: token ? `Bearer ${token}` : '', // Add the Authorization header if the token exists
    },
  };
});

// Combine authLink and uploadLink
const client = new ApolloClient({
  link: authLink.concat(uploadLink), // Combine both links for complete request handling
  cache: new InMemoryCache(), // Apollo's built-in caching mechanism for storing query results
});

export default client;
