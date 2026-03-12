import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} from "@/shared/utils/jwt";
import { JwtError } from "@/shared/errors/JwtError";

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
    process.env.JWT_ACCESS_SECRET = "test-secret";
    process.env.JWT_REFRESH_SECRET = "test-refresh-secret-key";
});

describe("JWT utils", () => {
    describe("signAccessToken", () => {
        it("signs access token with payload, secret and expiry", () => {
            (jwt.sign as any).mockReturnValue("signed-token");

            const result = signAccessToken({ userId: 1 });

            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: 1 },
                "test-secret",
                { expiresIn: "15m" },
            );

            expect(result).toBe("signed-token");
        });

        it("throws if JWT_ACCESS_SECRET is not defined", () => {
            delete process.env.JWT_ACCESS_SECRET;

            expect(() => signAccessToken({ userId: 1 })).toThrow(
                "JWT_ACCESS_SECRET is not defined",
            );
        });
    });

    describe("verifyAccessToken", () => {
        it("returns payload when token is valid", () => {
            (jwt.verify as any).mockReturnValue({ userId: 1 });

            const result = verifyAccessToken("valid-token");

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

            expect(() => verifyAccessToken("expired-token")).toThrow(JwtError);
            expect(() => verifyAccessToken("expired-token")).toThrow(
                "Access token expired",
            );
        });

        it("throws JwtError when token is invalid", () => {
            (jwt.verify as any).mockImplementation(() => {
                throw new jwt.JsonWebTokenError("invalid");
            });

            expect(() => verifyAccessToken("invalid-token")).toThrow(JwtError);
            expect(() => verifyAccessToken("invalid-token")).toThrow(
                "Invalid access token",
            );
        });

        it("rethrows unknown errors", () => {
            (jwt.verify as any).mockImplementation(() => {
                throw new Error("Unexpected failure");
            });

            expect(() => verifyAccessToken("token")).toThrow(
                "Unexpected failure",
            );
        });

        it("throws if JWT_ACCESS_SECRET is not defined", () => {
            delete process.env.JWT_ACCESS_SECRET;

            expect(() => verifyAccessToken("token")).toThrow(
                "JWT_ACCESS_SECRET is not defined",
            );
        });
    });

    describe("signRefreshToken", () => {
        it("signs refresh token with payload, secret and expiry", () => {
            (jwt.sign as any).mockReturnValue("signed-token");

            const result = signRefreshToken({ userId: 1 });
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: 1 },
                "test-refresh-secret-key",
                { expiresIn: "7d" },
            );

            expect(result).toBe("signed-token");
        });

        it("throws if JWT_REFRESH_SECRET is not defined", () => {
            delete process.env.JWT_REFRESH_SECRET;

            expect(() => signRefreshToken({ userId: 1 })).toThrow(
                "JWT_REFRESH_SECRET is not defined",
            );
        });
    });

    describe("verifyRefreshToken", () => {
        it("returns payload when token is valid", () => {
            (jwt.verify as any).mockReturnValue({ userId: 1 });

            const result = verifyRefreshToken("valid-token");
            expect(jwt.verify).toHaveBeenCalledWith(
                "valid-token",
                "test-refresh-secret-key",
            );

            expect(result).toEqual({ userId: 1 });
        });

        it("throws JwtError when token is expired", () => {
            (jwt.verify as any).mockImplementation(() => {
                throw new jwt.TokenExpiredError("expired", new Date());
            });

            expect(() => verifyRefreshToken("expired-token")).toThrow(JwtError);
            expect(() => verifyRefreshToken("expired-token")).toThrow(
                "Refresh token expired",
            );
        });

        it("throws JwtError when token is invalid", () => {
            (jwt.verify as any).mockImplementation(() => {
                throw new jwt.JsonWebTokenError("invalid");
            });

            expect(() => verifyRefreshToken("invalid-token")).toThrow(JwtError);
            expect(() => verifyRefreshToken("invalid-token")).toThrow(
                "Invalid refresh token",
            );
        });

        it("rethrows unknown errors", () => {
            (jwt.verify as any).mockImplementation(() => {
                throw new Error("Unexpected failure");
            });

            expect(() => verifyAccessToken("token")).toThrow(
                "Unexpected failure",
            );
        });

        it("throws if JWT_ACCESS_SECRET is not defined", () => {
            delete process.env.JWT_ACCESS_SECRET;

            expect(() => verifyAccessToken("token")).toThrow(
                "JWT_ACCESS_SECRET is not defined",
            );
        });
    });
});
