import { AppError } from "./AppError.js";

export class ConflictError extends AppError {
    statusCode = 409;
    isOperational = true;

    constructor(message: string) {
        super(message);
    }
}
