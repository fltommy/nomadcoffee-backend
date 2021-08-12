import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  context: async ({ req }) => {
    const token = req.headers.token;
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