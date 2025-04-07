import Razorpay from "razorpay";
import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient()

export const razor = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});