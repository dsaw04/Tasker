import { getChannel } from "../utils/rabbitmq.js";
import { sendDailyTaskEmail } from "../sendgrid/sendgrid.config.js";

const QUEUE_NAME = "emailQueue";

export const startEmailConsumer = async () => {
  try {
    const channel = await getChannel();

    // Ensure the queue exists
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // Start consuming messages
    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (msg !== null) {
          try {
            const message = JSON.parse(msg.content.toString());
            console.log("Message received from queue:", message); // Log the received message

            // Validate the message content
            const { email, username, tasks } = message;
            if (!email || !tasks || !Array.isArray(tasks)) {
              console.error("Invalid message format:", message);
              channel.nack(msg, false, false); // Reject without requeue
              return;
            }

            await sendDailyTaskEmail(email, tasks, username);
            console.log(`Email successfully sent to: ${email}`);
            channel.ack(msg); // Acknowledge the message after successful processing
          } catch (error) {
            console.error("Error processing message:", error);
            channel.nack(msg, false, true); // Requeue the message for retry
          }
        }
      },
      { noAck: false }
    );

    console.log(`Listening for messages on queue: ${QUEUE_NAME}`);
  } catch (error) {
    console.error("Error starting email consumer:", error);
  }
};
