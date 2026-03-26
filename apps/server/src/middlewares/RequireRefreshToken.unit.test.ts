import { describe, expect, it, vi } from "vitest";
import { requireRefreshToken } from "@/middlewares/RequireRefreshToken";
import { Request } from "express";

vi.mock("@/utils/jwt", () => ({
    verifyRefreshToken: vi.fn().mockReturnValue({ userId: 1 }),
}));

describe("requireRefreshToken", () => {
    it("calls next when refresh token exists", () => {
        const req: Partial<Request> = {
            cookies: { refreshToken: "valid-token" },
        };

        const next = vi.fn();

        requireRefreshToken(req as Request, {} as any, next);

        expect(next).toHaveBeenCalled();
    });

    it("throws UnauthorisedError when refresh token missing", () => {
        const req = {
            cookies: {},
        } as Request;

        expect(() => requireRefreshToken(req, {} as any, vi.fn())).toThrow(
            "Refresh token is missing",
        );
    });
});
