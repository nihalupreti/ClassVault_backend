const httpServer = require("http");
const app = require("./app");
const connectDB = require("./config/dbConnection");

connectDB();
const server = httpServer.createServer(app);

server.listen(3000, () => {
  console.log("listening at port 3000");
});
