const httpServer = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/dbConnection");
const mqConnection = require("./config/rabbitmq");
const processPdf = require("./services/processPdf");
const enrollService = require("./services/enrollService");
const socketHandler = require("./socket.io");

async function startConsumers() {
  try {
    await mqConnection.consume(enrollService, "course");
    await mqConnection.consume(processPdf, "pdf");

    console.log("Consumers started and listening to queues...");
  } catch (error) {
    console.error("Error starting consumers:", error);
  }
}

connectDB();
startConsumers();

const server = httpServer.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
socketHandler(io);

server.listen(3000, () => {
  console.log("listening at port 3000");
});
