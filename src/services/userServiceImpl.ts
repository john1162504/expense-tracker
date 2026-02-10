import { UserService } from "./UserService";
import { getPrisma } from "@/lib/prisma";
import { hashPassword, comparePassword } from "@/utils/Encryptor";
import { ConflictError } from "@/errors/ConflictError";
import { PubilicUerSchema } from "@/schemas/user.schema";
import { UnauthorisedError } from "@/errors/UnauthorisedError";
import { signToken } from "@/utils/jwt";
import { UnfoundError } from "@/errors/UnfoundError";

const prisma = getPrisma();

export const userService: UserService = {
    async register(data) {
        const existing = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existing) {
            throw new ConflictError("User with this email already exists");
        }

        const hashedPassword = await hashPassword(data.password);

        const newUser = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
            },
        });

        return PubilicUerSchema.parse(newUser);
    },

    async login(data) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
            },
        });

        if (!user || !(await comparePassword(data.password, user.password))) {
            throw new UnauthorisedError("Invalid email or password");
        }

        const token = signToken({ userId: user.id });

        return { token: token, user: PubilicUerSchema.parse(user) };
    },

    async getUserInfo(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UnfoundError("User not found");
        }

        return PubilicUerSchema.parse(user);
    },

    async updateUser(userId, data) {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
            },
        });

        return PubilicUerSchema.parse(updatedUser);
    },

    async deleteUser(userId) {
        await prisma.user.delete({
            where: { id: userId },
        });
    },
};
