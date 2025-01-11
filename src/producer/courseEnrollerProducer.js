const connectRabbitMQ = require("../config/rabbitmq"); // Import RabbitMQ connection logic

const sendCourseMessage = async (userData) => {
  try {
    const connection = await connectRabbitMQ();

    const channel = await connection.createChannel();

    const queue = "course_queue";
    await channel.assertQueue(queue, { durable: true });

    const message = JSON.stringify(userData);
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log("message sent to the queue");

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error sending login message:", error);
  }
};

module.exports = sendCourseMessage;
