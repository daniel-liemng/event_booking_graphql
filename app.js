const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const graphQLSchema = require("./graphql/schema/index");
const graphQLResolvers = require("./graphql/resolvers/index");

const isAuth = require("./middleware/isAuth");

require("dotenv").config();

const connectDB = require("./db");
connectDB();

const app = express();

// middleware
app.use(express.json());
app.use(isAuth);

// graphQL
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
