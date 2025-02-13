import { connectRabbitMQ } from "./rabbitmq.js";
import { startEmailConsumer } from "./emailConsumer.js";

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
