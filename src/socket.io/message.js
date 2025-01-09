module.exports = (io, socket) => {
  socket.on("message", ({ room, message, sender }) => {
    console.log(`Message from ${sender} in room ${room}: ${message}`);
    io.to(room).emit("message", { sender, message });
  });
};
