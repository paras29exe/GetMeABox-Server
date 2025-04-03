import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv"

dotenv.config()

const app = express();

// MIDDLEWARE - Plugins of express
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit: "20kb"}))
app.use(express.urlencoded({extended: true, limit: "20kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import ApiError from './utils/apiError.js';
import otpRoutes from './routes/otpRoutes.js';
import { configDotenv } from 'dotenv';

app.use('/api/otp', otpRoutes); 

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            success: err.success,
            message: err.message,
            details: err.details,
            timestamp: err.timestamp,
            errors: err.errors
        });
    } else {
        // Handle other errors (or create a default ApiError if you prefer)
        console.log(err)
        return res.status(500)
        .json(new ApiError(500, err.message, err));
    }
});

export {app}