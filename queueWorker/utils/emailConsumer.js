import { getChannel } from "../rabbitmq.js";
import { sendDailyTaskEmail } from "./sendgrid.config.js";

const QUEUE_NAME = "emailQueue";

export const startEmailConsumer = async () => {
  try {
    const channel = await getChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (msg !== null) {
          try {
            const message = JSON.parse(msg.content.toString());

            // Validate the message content
            const { email, username, tasks } = message;
            if (!email || !tasks || !Array.isArray(tasks)) {
              channel.nack(msg, false, false); // Reject without requeue
              return;
            }
            await sendDailyTaskEmail(email, tasks, username);
            channel.ack(msg);
          } catch (error) {
            channel.nack(msg, false, true);
          }
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Error starting email consumer:", error);
  }
};
