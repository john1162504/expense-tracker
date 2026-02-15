export abstract class AppError extends Error {
    abstract statusCode: number;
    abstract isOperational: boolean;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
