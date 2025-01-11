const connectRabbitMQ = require("../config/rabbitmq");
const { processStudent } = require("../services/enrollService");

const consumeLoginMessages = async () => {
  try {
    const connection = await connectRabbitMQ();

    const channel = await connection.createChannel();

    const queue = "course_queue";
    await channel.assertQueue(queue, { durable: true });

    console.log(`Waiting for messages in ${queue}...`);

    // Set up the consumer to listen for messages
    channel.consume(
      queue,
      async (msg) => {
        if (msg) {
          const userData = JSON.parse(msg.content.toString());
          await processStudent(userData);
          channel.ack(msg);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Error consuming login messages:", error);
  }
};

module.exports = consumeLoginMessages;
