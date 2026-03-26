import { Request, Response, NextFunction } from "express";
import { AppError } from "@/errors/AppError.js";
import logger from "@/utils/logger.js";

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
