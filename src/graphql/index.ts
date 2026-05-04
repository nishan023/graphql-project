import { ApolloServer } from "@apollo/server";
import { User } from "./user/index.js";

async function createApolloGraphqlServer() {
    const server = new ApolloServer({
        typeDefs: `#graphql
        ${User.typeDefs}

        type Query {
          hello: String!
          ${User.queries}
        }
         
        type Mutation {
          ${User.mutations}
        }
        `,
        resolvers: {
          Query: {
            hello: () => "Hello from GraphQL",
            ...User.resolvers.Query,
          },
          Mutation: {
            ...User.resolvers.Mutation,
          },
        },
      });
      await server.start();
      return server;
}

export default createApolloGraphqlServer;