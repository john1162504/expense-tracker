import { getPrisma } from "@/config/prisma";
import { hashPassword, comparePassword } from "@/shared/utils/encryptor";
import { ConflictError } from "@/shared/errors/ConflictError";
import {
    LoginInput,
    PubilicUerSchema,
    RegisterInput,
    UpdateUserInput,
} from "@/modules/auth/auth.schema";
import { UnauthorisedError } from "@/shared/errors/UnauthorisedError";
import { signToken } from "@/shared/utils/jwt";
import { UnfoundError } from "@/shared/errors/UnfoundError";

const prisma = getPrisma();

export const authService = {
    async register(data: RegisterInput) {
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

    async login(data: LoginInput) {
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

    async getUserInfo(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UnfoundError("User not found");
        }

        return PubilicUerSchema.parse(user);
    },

    async updateUser(userId: number, data: UpdateUserInput) {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
            },
        });

        return PubilicUerSchema.parse(updatedUser);
    },

    async deleteUser(userId: number) {
        await prisma.user.delete({
            where: { id: userId },
        });
    },
};
