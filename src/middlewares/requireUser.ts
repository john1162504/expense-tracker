import { UnauthorisedError } from "@/errors/UnauthorisedError";
import { Request } from "express";

export function requireUser(req: Request): void {
    if (!req.user) {
        throw new UnauthorisedError("Unauthenticated");
    }
}
