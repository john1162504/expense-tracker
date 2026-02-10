import { describe, it, expect } from "vitest";
import { requireUser } from "@/middlewares/requireUser";
import { UnauthorisedError } from "@/errors/UnauthorisedError";
import { Request } from "express";

describe("requireUser", () => {
    it("does nothing when req.user exists", () => {
        const req = {
            user: { id: 1 },
        } as Request;

        expect(() => requireUser(req)).not.toThrow();
    });

    it("throws UnauthorisedError when req.user is missing", () => {
        const req = {} as Request;

        expect(() => requireUser(req)).toThrow(UnauthorisedError);
        expect(() => requireUser(req)).toThrow("Unauthenticated");
    });
});
