import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { validate } from "@/shared/middlewares/validator";
import { InvalidRequest } from "@/shared/errors/InvalidRequest";
import { Request, Response, NextFunction } from "express";

describe("validate middleware", () => {
    const schema = z.object({
        email: z.string().email(),
    });

    it("throws InvalidRequest when validation fails", () => {
        const req = {
            body: { email: "not-an-email" },
        } as Request;

        const next = vi.fn();

        const middleware = validate(schema);

        expect(() => middleware(req, {} as Response, next)).toThrow(
            InvalidRequest,
        );

        expect(next).not.toHaveBeenCalled();
    });

    it("calls next and replaces req.body when validation succeeds", () => {
        const req = {
            body: { email: "test@example.com", ignored: "field" },
        } as Request;

        const next = vi.fn();

        const middleware = validate(schema);

        middleware(req, {} as Response, next);

        expect(req.body).toEqual({
            email: "test@example.com",
        });

        expect(next).toHaveBeenCalledOnce();
    });
});
