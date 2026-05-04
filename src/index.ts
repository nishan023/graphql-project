import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import "dotenv/config";
import { db } from "../lib/db.js";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const server = new ApolloServer({
    typeDefs: `type Query {
     hello: String
     sayName(name: String!): String
     }
     
     type Mutation {
     createUser(firstName: String!,lastName: String!,email: String!,password: String!): String
     }
     `,
    resolvers: {
      Query: {
        hello: () =>
          "hey there, this is a graphql server running with express and apollo server",
        sayName: (_, { name }: { name: String }) => {
          return `Hello, ${name}! Welcome to the world of GraphQL!`;
        },
      },
      Mutation: {
        createUser: async (
          _: any,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          },
        ) => {
          await db.user.create({
            data: {
              firstName,
              lastName,
              email,
              password,
              salt: "random_salt_value",
            },
          });
          return `User ${firstName} ${lastName} created successfully!`;
        },
      },
    },
  });
  await server.start();

  // create graphql endpoint
  app.use("/graphql", cors(), express.json(), expressMiddleware(server));

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello, World!" });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
startServer();
