import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import {
  verificationEmailTemplate,
  resetEmailTemplate,
} from "./emailTemplate.js";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_KEY);

export async function sendVerificationEmail(
  email,
  verificationToken,
  username
) {
  const msg = {
    to: { email },
    from: "admin@taskrapp.org",
    name: "Tasker",
    subject: "Verify your email",
    html: verificationEmailTemplate(username, verificationToken),
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(
      "Error sending test email:",
      error.response ? error.response.body : error
    );
  }
}

export async function sendResetPasswordEmail(email, resetLink, username) {
  const msg = {
    to: { email },
    from: "admin@taskrapp.org",
    name: "Tasker",
    subject: "Reset your password",
    html: resetEmailTemplate(username, resetLink),
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(
      "Error sending test email:",
      error.response ? error.response.body : error
    );
  }
}
