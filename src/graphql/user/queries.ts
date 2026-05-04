export const queries = `#graphql
  users: [User!]!
  user(id: ID!): User
  userByEmail(email: String!): User
`;