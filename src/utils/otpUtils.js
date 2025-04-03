import nodemailer from 'nodemailer';
import ApiError from './apiError.js';
import ApiResponse from './apiResponse.js';

// Generate 6-digit OTP
export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP Email
export const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        auth: {
            user: process.env.BREVO_SMTP_USER,
            pass: process.env.BREVO_SMTP_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Your OTP for GetMeABox',
        html: `<!DOCTYPE html>
                <html>
<body style="font-family: Arial, sans-serif; margin:0; padding:0;">
    <p>Your One-Time Password (OTP) for verification is:</p>
    <p style="font-size: 28px; font-weight: bold; color: #ff6600; text-align: center;">
        ${otp}
    </p>
    <p>This OTP is valid for <strong>5 minutes</strong>. Please use it to complete your verification.</p>
    <p>If you did not request this OTP, you can safely ignore this message.</p>
    <p>Best wishes,<br><strong>GetMeABox Team</strong><br>
    <a href="https://get-me-a-box.netlify.app" style="color: #007bff; text-decoration: none;">Visit Our Website</a></p>
    <p style="font-size: 10px; color: #aaa;">This is an automated email. Please do not reply.&nbsp;</p>
</body>
</html>
`,
    };

    await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            throw new ApiError(500, 'Error sending OTP on email:' + err)
        }
        else {
            return true;
        }
    })
    return true;
};
