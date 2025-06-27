import amqp from "amqplib";

let connection;

export const connectToRabbitMQ = async () => {
  try {
    if (connection) {
      console.log("RabbitMQ server is already connected");

      return connection;
    }

    connection = await amqp.connect(process.env.RABBITMQ_URL);
    console.log("Connected to RabbitMQ server");

    return connection;
  } catch (error) {
    console.error(error.message);
    throw Error(error.message);
  }
};
