import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { dailyTasksTemplate } from "./emailTemplate.js";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_KEY);

export async function sendDailyTaskEmail(email, tasks, username) {
  const msg = {
    to: email,
    from: {
      email: "admin@taskrapp.org",
      name: "Tasker",
    },
    subject: "Your Tasks for Today",
    html: dailyTasksTemplate(username, tasks),
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(
      "Error sending daily tasks email:",
      error.response ? error.response.body : error
    );
    throw error; // Re-throw the error for the consumer to handle it
  }
}
