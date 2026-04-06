import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/utils/jwt.js";
import { UnauthorisedError } from "@/errors/UnauthorisedError.js";

export const requireAccessToken = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
        throw new UnauthorisedError("Access token is missing");
    }

    const payload = verifyAccessToken(accessToken);
    req.user = {
        id: payload.userId,
    };

    next();
};
