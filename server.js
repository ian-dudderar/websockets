const { createServer } = require("http");
const next = require("next");
const { parse } = require("url");

const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let clients = [];

app.prepare().then(() => {
  // const httpServer = createServer(handler);
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;
      // console.log("PATH: ", pathname);
      if (pathname === "/api/websocket") {
        console.log("hit api");

        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString(); // convert Buffer to string
        });
        req.on("end", () => {
          let data = JSON.parse(body);
          console.log(data); // Body data
          clients.forEach((client) => {
            console.log("sending data to client");
            client.emit("update", data);
          });
        });
        // clients.forEach((client) => {
        //   client.emit("update", data);
        // });
      } else {
        await handler(req, res, parsedUrl);
      }
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("New client connected");
    clients.push(socket);
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(process.env.PORT || port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });

  setInterval(() => {
    clients.forEach((client) => {
      client.emit("time", new Date().toTimeString());
    });
  }, 1000);
});
