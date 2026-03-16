import request from "supertest";
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { app } from "@/App";
import { getPrisma } from "@/config/prisma";
import { authService } from "@/modules/auth/auth.service";
import TestAgent from "supertest/lib/agent";

async function registerUser(name: string, email: string, password: string) {
    return request(app).post("/api/auth/register").send({
        name: name,
        email: email,
        password: password,
    });
}

async function getAuthenticatedAgent(
    name: string,
    email: string,
    password: string,
) {
    const agent = request.agent(app);

    await agent.post("/api/auth/register").send({
        name: name,
        email: email,
        password: password,
    });

    await agent.post("/api/auth/login").send({
        email: email,
        password: password,
    });

    return agent;
}

describe("UserRoutes", () => {
    describe("POST/ registration", () => {
        it("rejects invalid data:", async () => {
            const res = await request(app).post("/api/auth/register").send({
                name: "",
                email: "not-an-email",
                password: "123",
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("error");
        });

        it("registers a new user with valid data:", async () => {
            const res = await request(app).post("/api/auth/register").send({
                name: "register User",
                email: "register@gmail.com",
                password: "password123",
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("success", true);
            expect(res.body).toHaveProperty("id");
        });

        it("registers with a repeated email:", async () => {
            const res = await registerUser(
                "Test User",
                "register@gmail.com",
                "password123",
            );

            expect(res.statusCode).toEqual(409);
            expect(res.body).toHaveProperty("error");
        });
    });

    describe("POST/ login", () => {
        beforeAll(async () => {
            await registerUser("login user", "login@email.com", "password123");
        });

        it("rejects invalid credentials:", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: "login@email.com",
                password: "wrongpassword",
            });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty("error");
        });

        it("rejects invalid data:", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: "not-an-email",
                password: "123",
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("error");
        });

        it("logins with valid credentials:", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: "login@email.com",
                password: "password123",
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("success", true);
            expect(res.body).toHaveProperty("accessToken");
            expect(res.body).toHaveProperty("user");
            expect(res.body.user).toHaveProperty("id");
            expect(res.body.user.email).toEqual("login@email.com");
            expect(res.body.user.name).toEqual("login user");
            expect(res.body.user).not.toHaveProperty("password");

            expect(res.headers["set-cookie"]).toBeDefined();
        });
    });

    describe("Post/ refresh-token", () => {
        let authAgent: TestAgent;

        beforeAll(async () => {
            authAgent = await getAuthenticatedAgent(
                "refresh user",
                "refresh@email.com",
                "password123",
            );
        });
        it("refreshes tokens with valid refresh token:", async () => {
            const res = await authAgent.post("/api/auth/refresh");

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("success", true);
            expect(res.body).toHaveProperty("accessToken");
            expect(res.headers["set-cookie"]).toBeDefined();

            const refreshToken = res.headers["set-cookie"][0]
                .split(";")[0]
                .split("=")[1];

            const res_2 = await authAgent.post("/api/auth/refresh");

            expect(
                res_2.headers["set-cookie"][0].split(";")[0].split("=")[1],
            ).not.toEqual(refreshToken);
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
            const res_refresh = await authAgent.post("/api/auth/refresh");

            const refreshToken = res_refresh.headers["set-cookie"][0]
                .split(";")[0]
                .split("=")[1];

            await authService.deleteRefreshToken(refreshToken);

            const res = await authAgent.post("/api/auth/refresh");

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty("error", "Refresh token not found");
        });
    });

    describe("POST/ logout", () => {
        let authAgent: TestAgent;

        beforeAll(async () => {
            authAgent = await getAuthenticatedAgent(
                "logout user",
                "logout@email.com",
                "password123",
            );
        });
        it("logs out an authenticated user:", async () => {
            const res = await authAgent.post("/api/auth/logout");

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
            const res = await request(app).post("/api/auth/register").send({
                name: "John",
                email: "john@example.com",
                password: "password123",
            });

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty("error", "Internal server error.");
        });
    });
});
