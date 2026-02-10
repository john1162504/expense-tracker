import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/utils/jwt";
import { UnauthorisedError } from "@/errors/UnauthorisedError";

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
    const payload = verifyToken(token);

    req.user = {
        id: payload.userId,
    };

    next();
};
