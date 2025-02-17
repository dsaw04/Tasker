import { connectRabbitMQ } from "./rabbitmq.js";
import { startEmailConsumer } from "./utils/emailConsumer.js";

const startQueueWorker = async () => {
  try {
    await connectRabbitMQ();
    startEmailConsumer();
  } catch (error) {
    console.error("Error in queue worker:", error);
    process.exit(1);
  }
};

startQueueWorker();
