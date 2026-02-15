import { Request, Response, NextFunction } from "express";
import { AppError } from "@/shared/errors/AppError";
import logger from "@/shared/utils/logger";

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
        });
    }

    logger.error(err, "Unhandled error occurred");

    return res.status(500).json({
        error: "Internal server error.",
    });
};
