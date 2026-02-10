import request from "supertest";
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { app } from "@/app";
import { getPrisma } from "@/lib/prisma";
import { userService } from "@/services/userServiceImpl";

describe("UserRoutes", () => {
    const prisma = getPrisma();

    afterAll(async () => {
        await prisma.$disconnect();
    });
    describe("POST/ registration", () => {
        it("rejects invalid data:", async () => {
            const res = await request(app).post("/api/users/register").send({
                name: "",
                email: "not-an-email",
                password: "123",
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("error");
        });

        it("registers a new user with valid data:", async () => {
            const res = await request(app).post("/api/users/register").send({
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("id");
        });

        it("registers with a repeated email:", async () => {
            const res = await request(app).post("/api/users/register").send({
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            });

            expect(res.statusCode).toEqual(409);
            expect(res.body).toHaveProperty("error");
        });
    });

    describe("POST/ login", () => {
        it("logins with valid credentials:", async () => {
            const res = await request(app).post("/api/users/login").send({
                email: "test@example.com",
                password: "password123",
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("token");
            expect(res.body).toHaveProperty("user");
            expect(res.body.user).toHaveProperty("id");
            expect(res.body.user.email).toEqual("test@example.com");
            expect(res.body.user.name).toEqual("Test User");
            expect(res.body.user).not.toHaveProperty("password");
        });

        it("rejects invalid credentials:", async () => {
            const res = await request(app).post("/api/users/login").send({
                email: "test@gmail.com",
                password: "wrongpassword",
            });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty("error");
        });

        it("rejects invalid data:", async () => {
            const res = await request(app).post("/api/users/login").send({
                email: "not-an-email",
                password: "123",
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("error");
        });
    });

    describe("GET/ user info", () => {
        let token: string;

        beforeAll(async () => {
            const res = await request(app).post("/api/users/login").send({
                email: "test@example.com",
                password: "password123",
            });
            token = res.body.token;
        });

        it("retrieves user info with invalid token:", async () => {
            const res = await request(app)
                .get("/api/users/me")
                .set("Authorization", "not a token");

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty("error");
        });

        it("retrieves user info with valid token:", async () => {
            const res = await request(app)
                .get("/api/users/me")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("id");
            expect(res.body.email).toEqual("test@example.com");
            expect(res.body.name).toEqual("Test User");
            expect(res.body).not.toHaveProperty("password");
        });
    });

    describe("PUT/ update user info", async () => {
        let token: string;

        beforeAll(async () => {
            const res = await request(app).post("/api/users/login").send({
                email: "test@example.com",
                password: "password123",
            });
            token = res.body.token;
        });

        it("updates user info with valid data:", async () => {
            const res = await request(app)
                .put("/api/users/me")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    name: "Updated User",
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("id");
            expect(res.body.name).toEqual("Updated User");
            expect(res.body.email).toEqual("test@example.com");
            expect(res.body).not.toHaveProperty("password");
        });

        it("rejects update with invalid data:", async () => {
            const res = await request(app)
                .put("/api/users/me")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    email: "not-an-email",
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("error");
        });
    });

    describe("DELETE/ delete user account", () => {
        let token: string;

        beforeAll(async () => {
            const res = await request(app).post("/api/users/login").send({
                email: "test@example.com",
                password: "password123",
            });
            token = res.body.token;
        });

        it("deletes user account with valid token:", async () => {
            const res = await request(app)
                .delete("/api/users/me")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toEqual(204);
        });

        it("rejects deletion with invalid token:", async () => {
            const res = await request(app)
                .delete("/api/users/me")
                .set("Authorization", "invalid token");

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty("error");
        });
    });

    describe("UserRoutes - service error handling", () => {
        const originalRegister = userService.register;

        beforeAll(() => {
            vi.spyOn(userService, "register").mockRejectedValue(
                new Error("Service error")
            );
        });

        afterAll(() => {
            userService.register = originalRegister;
            vi.clearAllMocks();
        });

        it("should return 500 when the service throws an unexpected error", async () => {
            const res = await request(app).post("/api/users/register").send({
                name: "John",
                email: "john@example.com",
                password: "password123",
            });

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty("error", "Internal server error.");
        });
    });
});
