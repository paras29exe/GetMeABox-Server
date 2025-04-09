export default class ApiError extends Error {
    constructor(
        statusCode,
        message,
        source = null,
        errors = [],
        stack = []
    ) {
        super();
        this.statusCode = statusCode;
        this.success = false;
        this.message = message;
        this.source = source; // Optional additional error source
        this.errors =  errors || Error ;
        this.timestamp = new Date().toISOString();

        if (stack.length > 0) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }

    static badRequest(message = "Bad Request", source = null, error = null) {
        return new ApiError(400, message, source, error);
    }

    static unauthorized(message = "Unauthorized", source = null, error = null) {
        return new ApiError(401, message, source, error);
    }

    static forbidden(message = "Forbidden", source = null, error = null) {
        return new ApiError(403, message, source, error);
    }

    static notFound(message = "Not Found", source = null, error = null) {
        return new ApiError(404, message, source, error);
    }

    static internalServerError(message = "Internal Server Error", source = null, error = null) {
        return new ApiError(500, message, source, error);
    }
}
