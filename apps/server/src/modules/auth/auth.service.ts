import { getPrisma } from "@/config/prisma";
import {
    hashPassword,
    compareHashed,
    hashToken,
} from "../../shared/utils/encryptor";
import { ConflictError } from "@/shared/errors/ConflictError";
import {
    LoginInput,
    PublicUserSchema,
    RegisterInput,
} from "@/modules/auth/auth.schema";
import { UnauthorisedError } from "@/shared/errors/UnauthorisedError";

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

        return PublicUserSchema.parse(newUser);
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

        if (!user || !(await compareHashed(data.password, user.password))) {
            throw new UnauthorisedError("Invalid email or password");
        }

        return PublicUserSchema.parse(user);
    },

    async storeRefreshToken(token: string, userId: number) {
        const tokenHash = await hashToken(token);
        const res = await prisma.refreshToken.create({
            data: {
                tokenHash,
                userId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });
    },

    async validateRefreshToken(token: string) {
        const tokenHash = await hashToken(token);
        const tokenRecord = await prisma.refreshToken.findUnique({
            where: {
                tokenHash,
            },
        });

        if (!tokenRecord) {
            throw new UnauthorisedError("Refresh token not found");
        }

        if (tokenRecord.expiresAt < new Date()) {
            throw new UnauthorisedError("Refresh token expired");
        }

        if (!(await compareHashed(token, tokenRecord.tokenHash))) {
            throw new UnauthorisedError("Invalid refresh token");
        }
    },

    async deleteRefreshToken(token: string) {
        const tokenHash = await hashToken(token);
        await prisma.refreshToken.deleteMany({
            where: {
                tokenHash,
            },
        });
    },
};
