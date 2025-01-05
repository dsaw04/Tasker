import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { verificationEmailTemplate } from "./emailTemplate.js";

// Load environment variables
dotenv.config();

// Set your SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_KEY);

export async function sendVerificationEmail(
  email,
  verificationToken,
  username
) {
  const msg = {
    to: { email },
    from: "admin@taskrapp.org",
    subject: "Verify your email",
    html: verificationEmailTemplate(username, verificationToken),
  };

  try {
    await sgMail.send(msg);
    console.log("Test email sent successfully!");
  } catch (error) {
    console.error(
      "Error sending test email:",
      error.response ? error.response.body : error
    );
  }
}
