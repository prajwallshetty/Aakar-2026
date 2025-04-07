"use server";

import { transporter } from ".";

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