import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  console.log("Connected to Browser");
  socket.nickname = "Anonymous";
  sockets.push(socket);

  socket.on("close", () => {
    console.log("Disconnected from Browser");
  });

  socket.on("message", (msg) => {
    const data = JSON.parse(msg);
    switch (data.type) {
      case "message":
        sockets.forEach((it) => it.send(`${socket.nickname}: ${data.payload}`));
        console.log(`New message: ${data.payload}`);
        break;

      case "nickname":
        socket.nickname = data.payload;
        console.log(data.payload);
        break;
    }
  });
});

// app.listen(3000, handleListen);
server.listen(3000, handleListen);
