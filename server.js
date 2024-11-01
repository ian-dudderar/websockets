// import { createServer } from "node:http";
// import next from "next";
// import { Server } from "socket.io";
const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let clients = [];

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("New client connected");
    clients.push(socket);
  });

  io.on("hello", (data) => {
    console.log("Hello from client", data);
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });

  setInterval(() => {
    clients.forEach((client) => {
      console.log(client);
      client.emit("time", new Date().toTimeString());
    });
  }, 1000);
});
