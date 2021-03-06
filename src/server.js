import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT;


const myPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart(requestContext) {
    console.log('Request started! Query:\n' +
      requestContext.request.query);

    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      async parsingDidStart(requestContext) {
        console.log('Parsing started!');
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      async validationDidStart(requestContext) {
        console.log('Validation started!');
      },

    }
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  // plugins: [
  //   myPlugin
  // ],
  playground: true,
  introspection: true,
  context: async ({ req }) => {
    const token = req.headers.token;
    // console.log(token);
    return {
      loggedInUser: await getUser(token),
    };
  },
});

apolloServer.start().then(() => {
  const app = express();

  app.use("/static", express.static("uploads"));
  app.use(graphqlUploadExpress());

  apolloServer.applyMiddleware({ app });

  app.listen({ port: PORT });

  console.log(`✅ Server is running on http://localhost:${PORT}/graphql`);
});