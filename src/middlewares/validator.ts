import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { InvalidRequest } from "@/errors/InvalidRequest";

export const validate =
    <T>(schema: z.ZodType<T>) =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            throw new InvalidRequest("Invalid request data");
        }

        req.body = result.data;
        next();
    };
