import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Set it to your Postgres connection string before starting the server.",
  );
}

const adapter = new PrismaPg({ connectionString });

export const db = new PrismaClient({
  adapter,
  log: ["query", "error", "warn"],
});