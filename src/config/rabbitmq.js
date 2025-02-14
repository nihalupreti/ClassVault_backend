const amqp = require("amqplib");
class RabbitMQConnection {
  connection;
  channel;
  connected = false;

  async connect() {
    if (this.connected && this.channel) return;
    else this.connected = true;

    try {
      console.log(`⌛️ Connecting to Rabbit-MQ Server`);
      this.connection = await amqp.connect(`amqp://localhost:5672`);

      console.log(`✅ Rabbit MQ Connection is ready`);

      this.channel = await this.connection.createChannel();

      console.log(`🛸 Created RabbitMQ Channel successfully`);
    } catch (error) {
      console.error(error);
      console.error(`Not connected to MQ Server`);
      this.connected = false;
    }
  }

  async sendToQueue(queue, message) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      console.log("called by: ", queue);
      // Assert the queue to ensure it exists before sending the message
      await this.channel.assertQueue(queue, { durable: true });

      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async consume(handleIncomingNotification, QUEUE_NAME) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      await this.channel.assertQueue(QUEUE_NAME, { durable: true });
      this.channel.consume(
        QUEUE_NAME,
        (msg) => {
          if (!msg) {
            console.error(`Invalid incoming message`);
            return;
          }

          const parsedMessage = JSON.parse(msg.content.toString());
          handleIncomingNotification(parsedMessage);
          this.channel.ack(msg);
        },
        { noAck: false }
      );
    } catch (error) {
      console.error("Error consuming messages:", error);
    }
  }
}

const mqConnection = new RabbitMQConnection();

module.exports = mqConnection;
