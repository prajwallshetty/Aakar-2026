import { sendEmail } from "../backend/nodemailer";

async function test() {
  try {
    console.log("Sending test email...");
    await sendEmail(
      "aakar2026@ajiet.edu.in", // Send to self
      "Test Email - Aakar 2026",
      "<h1>Test</h1><p>This is a test email from the server.</p>"
    );
    console.log("Test email sent!");
    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

test();
