import UserService from "../../services/user.service.js";

const queries = {
    me: async (_: any, parameters: any, context: any) => {
        if (context && context.user && context.user.id) {
            return await UserService.getUserByEmail(context.user.email);
        }
        throw new Error("Unauthorized");
    }
};

const mutations = {
    register: async (_: any, payload: any) => {
        const user = await UserService.createUser(payload);
        return `User created with id ${user.id}`;
    },
    login: async (_: any, payload: any) => {
        const token = await UserService.loginUser(payload.email, payload.password);
        return `User logged in successfully with token ${token}`;
    }
};

export const resolvers = { Query: queries, Mutation: mutations };
