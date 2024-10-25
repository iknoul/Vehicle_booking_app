// index.js

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

// Step 1: Define a GraphQL schema
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Step 2: Define a root resolver
const root = {
  hello: () => {
    return "Hello, GraphQL!";
  },
};

// Step 3: Create an Express server and a GraphQL endpoint
const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable GraphiQL tool to run queries
  })
);

app.listen(4000, () => console.log("Server running on http://localhost:4000/graphql"));
