import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError.js';
import User from '../models/user.model.js';

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")?.[1];

        if (!token) {
            throw ApiError.notFound("AccessToken not found, Login again to create one");
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if(!decodedToken?._id) {
            throw ApiError.unauthorized("Invalid access token");
        }

        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw ApiError.unauthorized("User not found");
        }

        req.user = user;
        next();
    } catch (err) {
        return next(ApiError.unauthorized("Access Token expired, Login again"))
    }
};

export default verifyUser;


