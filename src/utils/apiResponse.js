export default class ApiResponse {
    constructor(statusCode, message, data = null, meta = null) {
        this.status = statusCode;
        this.message = message;
        this.success = true; // always true for success responses
        this.data = data;
        this.meta = meta;
        this.timestamp = new Date().toISOString();
    }

    static success(data, message = "Success", meta = null) {
        return new ApiResponse(200, message, data, meta);
    }

    static created(data, message = "Resource created successfully") {
        return new ApiResponse(201, message, data);
    }
}
