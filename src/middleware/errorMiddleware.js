import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

const errorMiddleware = (err, req, res, next) => {
    try {
        if (err instanceof ApiError) {
            return res.status(err.statusCode).json(new ApiResponse(err.statusCode, err.message));
        }
        console.error('Unexpected Error:', err);
        return res.status(500).json(new ApiResponse(500, 'Internal Server Error'));
    } catch (internalError) {
        console.error('Error in errorMiddleware:', internalError);
        return res.status(500).json(new ApiResponse(500, 'Error handling middleware failed'));
    }
};

export default errorMiddleware;
