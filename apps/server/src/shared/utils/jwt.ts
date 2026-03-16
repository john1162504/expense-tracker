import jwt from "jsonwebtoken";
import { JwtError } from "@/shared/errors/JwtError";

const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";
const { JsonWebTokenError, TokenExpiredError } = jwt;

export type JwtPayload = {
    userId: number;
    jti: string;
};

function getAccessSecret(): string {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
        throw new Error("JWT_ACCESS_SECRET is not defined");
    }
    return secret;
}

function getRefreshSecret(): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new Error("JWT_REFRESH_SECRET is not defined");
    }
    return secret;
}

export const signAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, getAccessSecret(), {
        expiresIn: ACCESS_EXPIRES_IN,
    });
};

export const signRefreshToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, getRefreshSecret(), {
        expiresIn: REFRESH_EXPIRES_IN,
    });
};

export const verifyAccessToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, getAccessSecret()) as JwtPayload;
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            throw new JwtError("Access token expired");
        }
        if (err instanceof JsonWebTokenError) {
            throw new JwtError("Invalid access token");
        }
        throw err;
    }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, getRefreshSecret()) as JwtPayload;
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            throw new JwtError("Refresh token expired");
        }
        if (err instanceof JsonWebTokenError) {
            throw new JwtError("Invalid refresh token");
        }
        throw err; // rethrow other unexpected errors
    }
};
