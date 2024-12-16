const httpServer = require("http");
const app = require("./app");

const server = httpServer.createServer(app);

server.listen(3000, () => {
  console.log("listining at port 3000");
});
