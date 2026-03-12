import { vi, describe, it, expect, beforeEach, Mock } from "vitest";
import { authService } from "@/modules/auth/auth.service";
import {
    compareHashed,
    hashPassword,
    hashToken,
} from "../../shared/utils/encryptor";
import { UnauthorisedError } from "@/shared/errors/UnauthorisedError";

const prismaMock = vi.hoisted(() => ({
    user: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    refreshToken: {
        upsert: vi.fn(),
        findUnique: vi.fn(),
        deleteMany: vi.fn(),
    },
}));

vi.mock("@/config/prisma", () => {
    return {
        getPrisma: () => prismaMock,
    };
});

vi.mock("@/shared/utils/encryptor", () => {
    return {
        hashPassword: vi.fn(),
        hashToken: vi.fn(),
        compareHashed: vi.fn(),
    };
});

describe("auth.service tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("register", () => {
        it("should register a new user", async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);
            prismaMock.user.create.mockResolvedValue({
                id: 1,
                name: "Test User",
                email: "test@example.com",
                password: "hashedpassword",
            });

            (hashPassword as Mock).mockResolvedValue("hashedpassword");

            const result = await authService.register({
                name: "Test User",
                email: "test@example.com",
                password: "plain",
            });

            expect(prismaMock.user.create).toHaveBeenCalledWith({
                data: {
                    name: "Test User",
                    email: "test@example.com",
                    password: "hashedpassword",
                },
            });

            expect(result).toHaveProperty("id");
            expect(result).not.toHaveProperty("password");
        });

        it("should throw ConflictError if email already exists", async () => {
            prismaMock.user.findUnique.mockResolvedValue({
                id: 1,
                name: "Existing User",
                email: "test@example.com",
                password: "hashedpassword",
            });

            await expect(
                authService.register({
                    name: "New User",
                    email: "test@example.com",
                    password: "plain",
                }),
            ).rejects.toThrow("User with this email already exists");
            expect(prismaMock.user.create).not.toHaveBeenCalled();
        });
    });

    describe("login", () => {
        it("should login a user with valid credentials", async () => {
            prismaMock.user.findUnique.mockResolvedValue({
                id: 1,
                name: "Test User",
                email: "test@example.com",
                password: "hashedpassword",
            });

            (compareHashed as Mock).mockResolvedValue(true);

            const user = await authService.login({
                email: "test@example.com",
                password: "plain",
            });

            expect(user).toHaveProperty("id");
            expect(user).toHaveProperty("email", "test@example.com");
            expect(user).toHaveProperty("name", "Test User");
            expect(user).not.toHaveProperty("password");
        });

        it("should throw UnauthorisedError for invalid credentials", async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(
                authService.login({
                    email: "test@example.com",
                    password: "plain",
                }),
            ).rejects.toThrow(UnauthorisedError);
        });

        it("should throw UnauthorisedError for wrong password", async () => {
            prismaMock.user.findUnique.mockResolvedValue({
                id: 1,
                name: "Test User",
                email: "test@example.com",
                password: "hashedpassword",
            });

            (hashPassword as Mock).mockResolvedValue("differentpassword");
            (compareHashed as Mock).mockResolvedValue(false);

            await expect(
                authService.login({
                    email: "test@example.com",
                    password: "plain",
                }),
            ).rejects.toThrow(UnauthorisedError);
        });
    });

    describe("storeRefreshToken", () => {
        it("should hash and store the refresh token", async () => {
            (hashToken as Mock).mockResolvedValue("hashedtoken");

            await authService.storeRefreshToken("refreshtoken", 1);

            expect(hashToken).toHaveBeenCalledWith("refreshtoken");
            expect(prismaMock.refreshToken.upsert).toHaveBeenCalledWith({
                where: { userId: 1 },
                update: {
                    tokenHash: "hashedtoken",
                    expiresAt: expect.any(Date),
                },
                create: {
                    tokenHash: "hashedtoken",
                    userId: 1,
                    expiresAt: expect.any(Date),
                },
            });
        });
    });

    describe("validateRefreshToken", () => {
        it("should validate a correct refresh token", async () => {
            prismaMock.refreshToken.findUnique.mockResolvedValue({
                tokenHash: "hashedtoken",
                expiresAt: new Date(Date.now() + 10000), // not expired
            });

            (compareHashed as Mock).mockResolvedValue(true);

            await expect(
                authService.validateRefreshToken("refreshtoken", 1),
            ).resolves.not.toThrow();
        });

        it("should throw UnauthorisedError for expired token", async () => {
            prismaMock.refreshToken.findUnique.mockResolvedValue({
                tokenHash: "hashedtoken",
                expiresAt: new Date(Date.now() - 10000), // expired
            });

            expect(
                authService.validateRefreshToken("refreshtoken", 1),
            ).rejects.toThrow("Refresh token expired");
        });

        it("should throw UnauthorisedError for invalid token", async () => {
            prismaMock.refreshToken.findUnique.mockResolvedValue({
                tokenHash: "hashedtoken",
                expiresAt: new Date(Date.now() + 10000), // not expired
            });

            (compareHashed as Mock).mockResolvedValue(false);

            expect(
                authService.validateRefreshToken("refreshtoken", 1),
            ).rejects.toThrow("Invalid refresh token");
        });

        it("should throw UnauthorisedError if no token record found", async () => {
            prismaMock.refreshToken.findUnique.mockResolvedValue(null);

            expect(
                authService.validateRefreshToken("refreshtoken", 1),
            ).rejects.toThrow("Refresh token not found");
        });
    });

    describe("deleteRefreshToken", () => {
        it("should delete refresh token for a user", async () => {
            await authService.deleteRefreshToken(1);

            expect(prismaMock.refreshToken.deleteMany).toHaveBeenCalledWith({
                where: { userId: 1 },
            });
        });
    });
});
