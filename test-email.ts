import { sendEmail } from './backend/nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function testEmail() {
  console.log('Testing email sending to:', process.env.MAIL_USER);
  await sendEmail(
    process.env.MAIL_USER as string,
    'Test Email',
    '<h1>Test successful!</h1>'
  );
  console.log('Email sent (if no errors logged above).');
}

testEmail();
