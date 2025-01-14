import amqp from "amqplib";

let connection;
let channel;

export const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(
      process.env.RABBITMQ_URI || "amqp://localhost"
    );
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
    return channel;
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    throw error;
  }
};

export const getChannel = () => {
  if (!channel) {
    throw new Error(
      "RabbitMQ channel not initialized. Call connectRabbitMQ first."
    );
  }
  return channel;
};
