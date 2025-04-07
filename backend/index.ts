import Razorpay from "razorpay";
import { PrismaClient } from '@prisma/client';
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USER,
        clientId: process.env.MAIL_CLIENT_ID,
        clientSecret: process.env.MAIL_CLIENT_SECRET,
        accessToken: process.env.MAIL_ACCESS_TOKEN,
        refreshToken: process.env.MAIL_REFRESH_TOKEN
    }
});
export const db = new PrismaClient()

export const razor = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});