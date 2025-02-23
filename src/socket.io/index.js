const messageHandler = require("./message");
const roomHandler = require("./room");
const summaryHandler = require("./summary");
const { verifyJwt } = require("../utils/jwt");
const cookie = require("cookie");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    const userId = await authenticateSocket(socket);

    console.log("A user connected:", socket.id);
    socket.userId = userId;

    // Load event handlers
    messageHandler(io, socket);
    roomHandler(io, socket);
    summaryHandler(io, socket);

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};

async function authenticateSocket(socket) {
  const cookies = cookie.parse(socket.handshake.headers.cookie || "");
  const encryptedToken = cookies.authToken;
  const user = await verifyJwt(encryptedToken);
  if (!user) throw new Error("Invalid token");

  return user.userId;
}
