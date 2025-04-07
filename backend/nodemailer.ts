"use server";

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

export async function sendEmail(to: string, subject: string, text: string) {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      text
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}