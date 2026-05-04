import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import "dotenv/config";
import createApolloGraphqlServer from "./graphql/index.js";
import { context } from "../lib/context.js";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  

  // create graphql endpoint
  app.use("/graphql", cors(), express.json(), expressMiddleware(await createApolloGraphqlServer(), {
    context,
  }));

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello, from Graphql server" });
  });

  //health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
  });
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
startServer();
