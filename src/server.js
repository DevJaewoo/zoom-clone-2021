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
  sockets.push(socket);

  socket.on("close", () => {
    console.log("Disconnected from Browser");
  });

  socket.on("message", (message) => {
    sockets.forEach((it) => it.send(message.toString()));
    console.log(`New message: ${message}`);
    // socket.send(message.toString());
  });
});

// app.listen(3000, handleListen);
server.listen(3000, handleListen);
