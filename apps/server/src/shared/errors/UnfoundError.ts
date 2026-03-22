import { AppError } from "./AppError.js";

export class UnfoundError extends AppError {
    statusCode = 404;
    isOperational = true;

    constructor(message: string) {
        super(message);
    }
}
