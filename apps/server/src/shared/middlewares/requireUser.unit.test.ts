import { describe, it, expect } from "vitest";
import { requireUser } from "@/shared/middlewares/requireUser";
import { UnauthorisedError } from "@/shared/errors/UnauthorisedError";
import { Request } from "express";

describe("requireUser", () => {
    it("attaches user to request when user exists", () => {
        const req = {
            user: { id: 1 },
        } as Request;

        expect(() => requireUser(req)).not.toThrow();
        expect(req.user).toEqual({ id: 1 });
    });

    it("throws UnauthorisedError when req.user is missing", () => {
        const req = {} as Request;

        expect(() => requireUser(req)).toThrow(UnauthorisedError);
    });
});
