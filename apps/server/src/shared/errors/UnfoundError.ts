import { AppError } from "./AppError";

export class UnfoundError extends AppError {
    statusCode = 404;
    isOperational = true;

    constructor(message: string) {
        super(message);
    }
}
