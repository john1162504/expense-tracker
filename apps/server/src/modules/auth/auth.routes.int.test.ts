import request from "supertest";
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { app } from "@/App";
import { getPrisma } from "@/config/prisma";
import { authService } from "@/modules/auth/auth.service";
import { before } from "node:test";

const agent = request.agent(app);

describe("UserRoutes", () => {
    const prisma = getPrisma();

    afterAll(async () => {
        await prisma.$disconnect();
    });
    describe("POST/ registration", () => {
        it("rejects invalid data:", async () => {
            const res = await agent.post("/api/auth/register").send({
                name: "",
                email: "not-an-email",
                password: "123",
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("error");
        });

        it("registers a new user with valid data:", async () => {
            const res = await agent.post("/api/auth/register").send({
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("success", true);
            expect(res.body).toHaveProperty("id");
        });

        it("registers with a repeated email:", async () => {
            const res = await agent.post("/api/auth/register").send({
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            });

            expect(res.statusCode).toEqual(409);
            expect(res.body).toHaveProperty("error");
        });
    });

    describe("POST/ login", () => {
        it("rejects invalid credentials:", async () => {
            const res = await agent.post("/api/auth/login").send({
                email: "test@gmail.com",
                password: "wrongpassword",
            });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty("error");
        });

        it("rejects invalid data:", async () => {
            const res = await agent.post("/api/auth/login").send({
                email: "not-an-email",
                password: "123",
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("error");
        });

        it("logins with valid credentials:", async () => {
            const res = await agent.post("/api/auth/login").send({
                email: "test@example.com",
                password: "password123",
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("success", true);
            expect(res.body).toHaveProperty("accessToken");
            expect(res.body).toHaveProperty("user");
            expect(res.body.user).toHaveProperty("id");
            expect(res.body.user.email).toEqual("test@example.com");
            expect(res.body.user.name).toEqual("Test User");
            expect(res.body.user).not.toHaveProperty("password");

            expect(res.headers["set-cookie"]).toBeDefined();
        });

        it("logins with valid credentials but user already has a token in db:", async () => {
            const res = await agent.post("/api/auth/login").send({
                email: "test@example.com",
                password: "password123",
            });

            expect(res.statusCode).toEqual(200);
        });
    });

    describe("Post/ refresh-token", () => {
        it("refreshes tokens with valid refresh token:", async () => {
            const res = await agent.post("/api/auth/refresh");

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("success", true);
            expect(res.body).toHaveProperty("accessToken");
            expect(res.headers["set-cookie"]).toBeDefined();
        });

        it("rejects refresh with missing refresh token:", async () => {
            const res = await request(app).post("/api/auth/refresh");

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty(
                "error",
                "Refresh token is missing",
            );
        });

        it("rejects refresh with invalid refresh token:", async () => {
            const res = await request(app)
                .post("/api/auth/refresh")
                .set("cookie", "refreshToken=invalidtoken");

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty("error", "Invalid refresh token");
        });

        it("rejects valid but non-existent refresh token:", async () => {
            await authService.deleteRefreshToken(1);

            const res = await agent.post("/api/auth/refresh");

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty("error", "Refresh token not found");

            vi.clearAllMocks();
        });
    });

    describe("POST/ logout", () => {
        beforeAll(async () => {
            await agent.post("/api/auth/login").send({
                email: "test@example.com",
                password: "password123",
            });
        });
        it("logs out an authenticated user:", async () => {
            const res = await agent.post("/api/auth/logout");

            expect(res.statusCode).toEqual(204);
        });
    });

    describe("UserRoutes - service error handling", () => {
        const originalRegister = authService.register;

        beforeAll(() => {
            vi.spyOn(authService, "register").mockRejectedValue(
                new Error("Service error"),
            );
        });

        afterAll(() => {
            authService.register = originalRegister;
            vi.clearAllMocks();
        });

        it("should return 500 when the service throws an unexpected error", async () => {
            const res = await agent.post("/api/auth/register").send({
                name: "John",
                email: "john@example.com",
                password: "password123",
            });

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty("error", "Internal server error.");
        });
    });
});
