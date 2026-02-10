import { vi, describe, it, expect, beforeEach, afterEach, Mock } from "vitest";
import { userService } from "@/services/userServiceImpl";
import { comparePassword, hashPassword } from "@/utils/Encryptor";
import { UnauthorisedError } from "@/errors/UnauthorisedError";

const prismaMock = vi.hoisted(() => ({
    user: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
}));

vi.mock("@/lib/prisma", () => {
    return {
        getPrisma: () => prismaMock,
    };
});

vi.mock("@/utils/Encryptor", () => {
    return {
        hashPassword: vi.fn(),
        comparePassword: vi.fn(),
    };
});

describe("UserService Tests", () => {
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

            const result = await userService.register({
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
                userService.register({
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

            (hashPassword as Mock).mockResolvedValue("hashedpassword");
            (comparePassword as Mock).mockResolvedValue(true);

            const result = await userService.login({
                email: "test@example.com",
                password: "plain",
            });

            expect(result).toHaveProperty("token");
            expect(result).toHaveProperty("user");
            expect(result.user).not.toHaveProperty("password");
        });

        it("should throw UnauthorisedError for invalid credentials", async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(
                userService.login({
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
            (comparePassword as Mock).mockResolvedValue(false);

            await expect(
                userService.login({
                    email: "test@example.com",
                    password: "plain",
                }),
            ).rejects.toThrow(UnauthorisedError);
        });
    });

    describe("getUserInfo", () => {
        it("should return user info for valid userId", async () => {
            prismaMock.user.findUnique.mockResolvedValue({
                id: 1,
                name: "Test User",
                email: "test@example.com",
                password: "hashedpassword",
            });

            const result = await userService.getUserInfo(1);

            expect(result).toHaveProperty("id", 1);
            expect(result).toHaveProperty("name", "Test User");
            expect(result).not.toHaveProperty("password");
        });

        it("should throw UnfoundError for non-existing userId", async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(userService.getUserInfo(999)).rejects.toThrow(
                "User not found",
            );
        });
    });

    describe("updateUser", () => {
        it("should update user info", async () => {
            prismaMock.user.update.mockResolvedValue({
                id: 1,
                name: "Updated User",
                email: "test@example.com",
                password: "hashedpassword",
            });

            const result = await userService.updateUser(1, {
                name: "Updated User",
            });

            expect(result).toHaveProperty("id", 1);
            expect(result).toHaveProperty("name", "Updated User");
            expect(result).not.toHaveProperty("password");
        });
    });

    describe("deleteUser", () => {
        it("should delete user", async () => {
            prismaMock.user.delete.mockResolvedValue({
                id: 1,
                name: "Deleted User",
                email: "test@example.com",
                password: "hashedpassword",
            });

            await userService.deleteUser(1);

            expect(prismaMock.user.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });
    });
});
