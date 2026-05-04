import { db } from "../../lib/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface CreateUserPayload {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    profileImage?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-local-dev";

class UserService {
    public static async createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password, profileImage } = payload;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await db.user.create({
            data: {
                firstName,
                lastName: lastName || "",
                email,
                password: hashedPassword,
                ...(profileImage ? { profileImageUrl: profileImage } : {})
            }
        });

        return user;
    }

    public static async getUserByEmail(email: string) {
        return db.user.findUnique({ where: { email } });
    }

    public static getUserToken(payload: { id: string; email: string }) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
    }

    public static async loginUser(email: string, password: string) {
        const user = await UserService.getUserByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const token = UserService.getUserToken({ id: user.id, email: user.email });
        return token;
    }
}

export default UserService;