import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import { signToken, verifyToken } from "@/utils/jwt";
import { JwtError } from "@/errors/JwtError";

vi.mock("jsonwebtoken", () => {
    class TokenExpiredError extends Error {}
    class JsonWebTokenError extends Error {}

    return {
        default: {
            sign: vi.fn(),
            verify: vi.fn(),
            TokenExpiredError,
            JsonWebTokenError,
        },
    };
});

beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
});

describe("JWT utils", () => {
    describe("signToken", () => {
        it("signs token with payload, secret and expiry", () => {
            (jwt.sign as any).mockReturnValue("signed-token");

            const result = signToken({ userId: 1 });

            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: 1 },
                "test-secret",
                { expiresIn: "1h" },
            );

            expect(result).toBe("signed-token");
        });

        it("throws if JWT_SECRET is not defined", () => {
            delete process.env.JWT_SECRET;

            expect(() => signToken({ userId: 1 })).toThrow(
                "JWT_SECRET is not defined",
            );
        });
    });

    describe("verifyToken", () => {
        it("returns payload when token is valid", () => {
            (jwt.verify as any).mockReturnValue({ userId: 1 });

            const result = verifyToken("valid-token");

            expect(jwt.verify).toHaveBeenCalledWith(
                "valid-token",
                "test-secret",
            );

            expect(result).toEqual({ userId: 1 });
        });

        it("throws JwtError when token is expired", () => {
            (jwt.verify as any).mockImplementation(() => {
                throw new jwt.TokenExpiredError("expired", new Date());
            });

            expect(() => verifyToken("expired-token")).toThrow(JwtError);
            expect(() => verifyToken("expired-token")).toThrow("Token expired");
        });

        it("throws JwtError when token is invalid", () => {
            (jwt.verify as any).mockImplementation(() => {
                throw new jwt.JsonWebTokenError("invalid");
            });

            expect(() => verifyToken("invalid-token")).toThrow(JwtError);
            expect(() => verifyToken("invalid-token")).toThrow("Invalid token");
        });

        it("rethrows unknown errors", () => {
            (jwt.verify as any).mockImplementation(() => {
                throw new Error("Unexpected failure");
            });

            expect(() => verifyToken("token")).toThrow("Unexpected failure");
        });

        it("throws if JWT_SECRET is not defined", () => {
            delete process.env.JWT_SECRET;

            expect(() => verifyToken("token")).toThrow(
                "JWT_SECRET is not defined",
            );
        });
    });
});
