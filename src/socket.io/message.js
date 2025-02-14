const GroupMessage = require("../models/GroupMessage");

module.exports = (io, socket) => {
  socket.on("message", async ({ room, message, sender }) => {
    console.log(`Message from ${sender} in room ${room}: ${message}`);

    const userMessage = await GroupMessage.create({
      group: room,
      user: socket.userId,
      message,
    });

    const time = new Date().toLocaleTimeString();

    io.to(room).emit("message", {
      sender,
      message,
      time,
    });
  });
};
