import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { errorHandler } from "@/middlewares/ErrorHandler";
import { Request, Response } from "express";
import { InvalidRequest } from "@/errors/InvalidRequest";

describe("ErrorHandler Middleware", () => {
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
    it("returns AppError status and message", () => {
        const err = new InvalidRequest("Bad request");
        const req = {} as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        errorHandler(err, req, res, vi.fn());

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Bad request",
        });
    });

    it("returns 500 for unknown errors", () => {
        const err = new Error("boom");
        const req = {} as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        errorHandler(err, req, res, vi.fn());

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Internal server error.",
        });
    });
});
