import { getChannel } from "../utils/rabbitmq.js";

const EMAIL_QUEUE = "emailQueue";

export const publishEmailTask = async (email, username, tasks) => {
  try {
    const channel = await getChannel(); // Ensure you await the channel initialization

    // Ensure the queue exists
    await channel.assertQueue(EMAIL_QUEUE, { durable: true });

    // Add username to the message
    const message = { email, username, tasks };
    console.log("Publishing message to queue:", message); // Log the message being published
    channel.sendToQueue(EMAIL_QUEUE, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log(`Email task published for ${email} (${username})`);
  } catch (error) {
    console.error("Error publishing email task:", error);
    throw error;
  }
};
