const amqp = require("amqplib");

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    console.log("Connected to RabbitMQ");
    return connection;
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
};

module.exports = connectRabbitMQ;
