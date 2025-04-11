import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 15 * 24 * 60 * 60 * 1000
};

export const signupUser = asyncHandler(async (req, res, next) => {
    const { name, password, dob } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!name || !email || !password || !dob) {
        throw ApiError.badRequest('All fields are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw ApiError.unauthorized('Email already registered');
    }

    const user = await User.create({
        name,
        email,
        password,
        dob: new Date(dob),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundType=gradientLinear`
    });

    if (!user) {
        throw ApiError.internalServerError('User registration failed');
    }

    loginUser({ body: { email, password } }, res, next); // Pass only req.body and res
});

export const loginUser = asyncHandler(async (req, res, next) => {
    const password = req.body.password;
    const email = req.body.email?.trim().toLowerCase();

    if (!email || !password) {
        throw ApiError.badRequest('Email and password are required');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw ApiError.notFound('User with this email does not exist');
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
        throw ApiError.unauthorized('Invalid password! Please try again');
    }

    const token = await user.generateToken();

    return res.status(200)
        .cookie('accessToken', token, cookieOptions)
        .json(ApiResponse.success(user, 'User logged in successfully'));
});

export const autoLogin = asyncHandler(async (req, res, next) => {
    try {
        const token = await req.user.generateToken();
        return res.status(200)
            .cookie('accessToken', token, cookieOptions)
            .json(ApiResponse.success(req.user, 'User auto-logged in successfully'));
    } catch (error) {
        throw error;
    }
});


export const changePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw ApiError.badRequest('Old password and new password are required');
    }
    const user = await User.findById(req.user._id);

    const isValidPassword = await user.comparePassword(oldPassword);

    if (!isValidPassword) {
        throw ApiError.unauthorized('Invalid old password! Please try again');
    }

    user.password = newPassword;
    await user.save();

    return res.status(200)
        .json(ApiResponse.success({}, 'Password changed successfully'));
})

export const logoutUser = asyncHandler(async (req, res, next) => {
    return res.status(200)
        .clearCookie('accessToken', cookieOptions)
        .json(ApiResponse.success({}, 'User logged out successfully'));
});

export const checkExistence = asyncHandler(async (req, res, next) => {
    const email = req.body.email?.trim().toLowerCase() || '';
    const user = await User.findOne({ email });

    if (user) {
        throw ApiError.badRequest('Account with this email already exists');
    }
    return res.status(200)
        .json(ApiResponse.success({}, 'Account creation available'));
})