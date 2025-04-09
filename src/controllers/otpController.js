import OTP from '../models/otp.model.js';
import { generateOTP, sendOTPEmail } from '../utils/otpUtils.js';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';

export const requestOTP = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) throw new ApiError(400, 'Email is required');

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await OTP.deleteMany({ email });
        await OTP.create({ email, otp, expiresAt });

        const emailSent = await sendOTPEmail(email, otp);
        if (!emailSent) throw new ApiError(500, 'Failed to send OTP');

        return res.status(200).json(new ApiResponse(200, 'OTP sent successfully! Please check your Email'));
    } catch (error) {
        next(error);
    }
};

export const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) throw new ApiError(400, 'Email and OTP are required');

        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) throw new ApiError(400, 'Invalid OTP, Please try again.');
        if (otpRecord.expiresAt < new Date()) throw new ApiError(400, 'OTP expired');

        // once the otp is verified, delete it from the database
        await OTP.deleteMany({ email });
        return res.status(200).json(new ApiResponse(200, 'OTP verified successfully'));
    } catch (error) {
        next(error);
    }
};
