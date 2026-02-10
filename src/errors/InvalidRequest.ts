import { AppError } from "./AppError";

export class InvalidRequest extends AppError {
    statusCode = 400;
    isOperational = true;

    constructor(message: string) {
        super(message);
    }
}
