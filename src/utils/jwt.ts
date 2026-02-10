import jwt from "jsonwebtoken";
import { JwtError } from "@/errors/JwtError";

const JWT_EXPIRES_IN = "1h";
const { JsonWebTokenError, TokenExpiredError } = jwt;

export type JwtPayload = {
    userId: number;
};

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    return secret;
}

export const signToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: JWT_EXPIRES_IN,
    });
};

export const verifyToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, getJwtSecret()) as JwtPayload;
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            throw new JwtError("Token expired");
        }
        if (err instanceof JsonWebTokenError) {
            throw new JwtError("Invalid token");
        }
        throw err; // real bug, not auth failure
    }
};
