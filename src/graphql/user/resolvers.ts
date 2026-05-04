import crypto from "crypto";
import { db } from "../../../lib/db.js";

type CreateUserArgs = {
  input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profileImageUrl?: string | null;
  };
};

type UpdateUserArgs = {
  id: string;
  input: {
    firstName?: string | null;
    lastName?: string | null;
    profileImageUrl?: string | null;
  };
};

type DeleteUserArgs = { id: string };
type UserArgs = { id: string };
type UserByEmailArgs = { email: string };

function hashPassword(password: string, salt: string) {
  // PBKDF2 is built-in and fine for a starter project.
  return crypto.pbkdf2Sync(password, salt, 310000, 32, "sha256").toString("hex");
}

export const resolvers = {
  Query: {
    users: async () => {
      return db.user.findMany({
        orderBy: { firstName: "asc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profileImageUrl: true,
        },
      });
    },
    user: async (_: unknown, args: UserArgs) => {
      return db.user.findUnique({
        where: { id: args.id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profileImageUrl: true,
        },
      });
    },
    userByEmail: async (_: unknown, args: UserByEmailArgs) => {
      return db.user.findUnique({
        where: { email: args.email.toLowerCase() },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profileImageUrl: true,
        },
      });
    },
  },
  Mutation: {
    createUser: async (_: unknown, args: CreateUserArgs) => {
      const email = args.input.email.toLowerCase().trim();
      const salt = crypto.randomBytes(16).toString("hex");
      const passwordHash = hashPassword(args.input.password, salt);

      return db.user.create({
        data: {
          firstName: args.input.firstName.trim(),
          lastName: args.input.lastName.trim(),
          email,
          profileImageUrl: args.input.profileImageUrl ?? null,
          password: passwordHash,
          salt,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profileImageUrl: true,
        },
      });
    },
    updateUser: async (_: unknown, args: UpdateUserArgs) => {
      return db.user.update({
        where: { id: args.id },
        data: {
          ...(args.input.firstName != null ? { firstName: args.input.firstName.trim() } : {}),
          ...(args.input.lastName != null ? { lastName: args.input.lastName.trim() } : {}),
          ...(args.input.profileImageUrl !== undefined
            ? { profileImageUrl: args.input.profileImageUrl }
            : {}),
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profileImageUrl: true,
        },
      });
    },
    deleteUser: async (_: unknown, args: DeleteUserArgs) => {
      await db.user.delete({ where: { id: args.id } });
      return true;
    },
  },
};