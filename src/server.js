const httpServer = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = require("./app");
const connectDB = require("./config/dbConnection");
const consumeLoginMessages = require("./consumer/enrollerWorker");
const socketHandler = require("./socket.io");

connectDB();
consumeLoginMessages();

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
