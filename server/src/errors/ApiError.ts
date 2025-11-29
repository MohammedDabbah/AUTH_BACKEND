export class ApiError extends Error {
    status: number;
    isOperational: boolean; // to distinguish controlled errors from crashes

    constructor(status: number, message: string, isOperational = true) {
        super(message);
        this.status = status;
        this.isOperational = isOperational;

        // Restore prototype chain (important for TS)
        Object.setPrototypeOf(this, new.target.prototype);
    }

    static badRequest(msg: string): ApiError {
        return new ApiError(400, msg);
    }

    static unauthorized(msg: string = "Unauthorized"): ApiError {
        return new ApiError(401, msg);
    }

    static forbidden(msg: string = "Forbidden"): ApiError {
        return new ApiError(403, msg);
    }

    static notfound(msg: string = "Not Found"): ApiError {
        return new ApiError(404, msg);
    }

    static internal(msg: string = "Internal Server Error"): ApiError {
        return new ApiError(500, msg);
    }

    static serviceUnavailable(msg: string = "Service Unavailable"): ApiError {
        // For example: when Google OAuth is down
        return new ApiError(503, msg);
    }
}
