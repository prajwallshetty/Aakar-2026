"use server";

import nodemailer from "nodemailer";

const mailConfig: any = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USER,
    clientId: process.env.MAIL_CLIENT_ID,
    clientSecret: process.env.MAIL_CLIENT_SECRET,
    refreshToken: process.env.MAIL_REFRESH_TOKEN
  }
};

// Only add accessToken if strictly provided and not empty
if (process.env.MAIL_ACCESS_TOKEN) {
  mailConfig.auth.accessToken = process.env.MAIL_ACCESS_TOKEN;
}

const transporter = nodemailer.createTransport(mailConfig);

export async function sendEmail(to: string, subject: string, html: string, attachments?: { filename: string, content: Buffer | string, contentType?: string }[]) {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      html,
      attachments
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}