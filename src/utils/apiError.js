export default class ApiError extends Error {
    constructor(
        statusCode,
        message,
        details = null,
        errors = [],
        stack = []
    ) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.message = message;
        this.details = details; // Optional additional error details
        this.errors = (errors.length > 0)? errors : Error;
        this.timestamp = new Date().toISOString();

        if (stack.length > 0) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }

    static badRequest(message = "Bad Request", details = null) {
        return new ApiError(400, message, details);
    }

    static unauthorized(message = "Unauthorized", details = null) {
        return new ApiError(401, message, details);
    }

    static forbidden(message = "Forbidden", details = null) {
        return new ApiError(403, message, details);
    }

    static notFound(message = "Not Found", details = null) {
        return new ApiError(404, message, details);
    }

    static serverError(message = "Internal Server Error", details = null) {
        return new ApiError(500, message, details);
    }
}
