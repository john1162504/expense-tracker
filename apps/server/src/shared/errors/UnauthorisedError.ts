import { AppError } from "./AppError.js";

export class UnauthorisedError extends AppError {
    statusCode = 401;
    isOperational = true;

    constructor(message: string) {
        super(message);
    }
}
