export default class ApiResponse {
    constructor(statusCode, message, data = null, meta = null) {
        this.status = statusCode;
        this.message = message;
        this.data = data;
        this.meta = meta;  // Additional metadata (e.g., pagination info)
        this.timestamp = new Date().toISOString(); // Response time
    }

    static success(  data, message = "Success", meta = null) {
        return new ApiResponse(200, message, data, meta);
    }

    static created(data, message = "Resource created successfully") {
        return new ApiResponse(201, message, data);
    }

    static badRequest(message = "Bad request") {
        return new ApiResponse(400, message);
    }

    static unauthorized(message = "Unauthorized access") {
        return new ApiResponse(401, message);
    }

    static forbidden(message = "Forbidden") {
        return new ApiResponse(403, message);
    }

    static notFound(message = "Resource not found") {
        return new ApiResponse(404, message);
    }

    static serverError(message = "Internal Server Error") {
        return new ApiResponse(500, message);
    }
}
