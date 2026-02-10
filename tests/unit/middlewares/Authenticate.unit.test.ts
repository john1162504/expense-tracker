import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { authenticate } from "@/middlewares/Authenticate";
import { UnauthorisedError } from "@/errors/UnauthorisedError";
import { verifyToken } from "@/utils/jwt";
vi.mock("@/utils/jwt");

describe("Authenticate Middleware", () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        req = { headers: {} };
        res = {};
        next = vi.fn();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it("should throw UnauthorisedError if authorization header is missing", () => {
        expect(() => authenticate(req, res, next)).toThrow(UnauthorisedError);
    });

    it("should throw UnauthorisedError if authorization header is invalid", () => {
        req.headers.authorization = "InvalidHeader";
        expect(() => authenticate(req, res, next)).toThrow(UnauthorisedError);
    });

    it("should verify token and attach user to request", () => {
        req.headers.authorization = "Bearer valid.token.here";
        const mockPayload = { userId: 123 };
        (verifyToken as any).mockReturnValue(mockPayload);

        authenticate(req, res, next);

        expect(verifyToken).toHaveBeenCalledWith("valid.token.here");
        expect(req.user).toEqual({ id: 123 });
        expect(next).toHaveBeenCalled();
    });
});
