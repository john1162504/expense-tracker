import { Request, Response, NextFunction } from "express";
import { verifyRefreshToken } from "@/utils/jwt.js";
import { UnauthorisedError } from "@/errors/UnauthorisedError.js";

export const requireRefreshToken = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new UnauthorisedError("Refresh token is missing");
    }

    const payload = verifyRefreshToken(refreshToken);
    req.user = {
        id: payload.userId,
    };

    next();
};
