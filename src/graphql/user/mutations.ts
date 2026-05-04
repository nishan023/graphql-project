export const mutations = `#graphql
    register(firstName: String!, lastName: String, email: String!, password: String!): String
    login(email: String!, password: String!): String
`;