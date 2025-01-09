module.exports = (io, socket) => {
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);
  });

  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`${socket.id} left room: ${room}`);
  });
};
