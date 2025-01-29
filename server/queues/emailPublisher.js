import { getChannel } from "../utils/rabbitmq.js";

const EMAIL_QUEUE = "emailQueue";

export const publishEmailTask = async (email, username, tasks) => {
  try {
    const channel = await getChannel();
    await channel.assertQueue(EMAIL_QUEUE, { durable: true });

    const message = { email, username, tasks };
    channel.sendToQueue(EMAIL_QUEUE, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  } catch (error) {
    console.error("Error publishing email task:", error);
    throw error;
  }
};
