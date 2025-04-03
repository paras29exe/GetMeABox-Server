import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const mailOptions = {
    from: process.env.SMTP_USER,
    to: 'your-test-email@example.com',
    subject: 'SMTP Test Email',
    text: 'This is a test email from Brevo SMTP setup.'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('SMTP Test Failed:', error);
    } else {
        console.log('SMTP Test Success:', info.response);
    }
});
