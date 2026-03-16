import { Request, Response, NextFunction } from "express";
import { AppError } from "@/shared/errors/AppError";
import logger from "../utils/logger";
import { success } from "zod";

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
    }

    logger.error(err, "Unhandled error occurred");

    return res.status(500).json({
        success: false,
        error: "Internal server error.",
    });
};
