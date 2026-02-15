// errors/JwtError.ts
import { AppError } from "./AppError";

export class JwtError extends AppError {
    statusCode = 401;
    isOperational = true;
    constructor(message: string) {
        super(message);
    }
}
