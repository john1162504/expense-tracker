import { UnauthorisedError } from "@/errors/UnauthorisedError.js";
import { Request } from "express";

export function requireUser(req: Request): void {
    if (!req.user) {
        throw new UnauthorisedError("Unauthenticated");
    }
}
