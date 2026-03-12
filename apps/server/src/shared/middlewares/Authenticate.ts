import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { UnauthorisedError } from "@/shared/errors/UnauthorisedError";

export interface AuthenticatedRequest extends Request {
    user: {
        id: number;
    };
}

export const authenticate = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorisedError("Missing or invalid authorization header");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    req.user = {
        id: payload.userId,
    };

    next();
};
