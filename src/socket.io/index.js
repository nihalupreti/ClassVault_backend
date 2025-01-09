const messageHandler = require("./message");
const roomHandler = require("./room");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Load event handlers
    messageHandler(io, socket);
    roomHandler(io, socket);

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};
