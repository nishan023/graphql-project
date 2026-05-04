export const typeDefs = `#graphql
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    profileImageUrl: String
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    profileImageUrl: String
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    profileImageUrl: String
  }
`;