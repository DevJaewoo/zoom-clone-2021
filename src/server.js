import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
//import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(wsServer, {
  auth: false,
});
// const wss = new WebSocket.Server({ server });

// const sockets = [];
function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;

  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });

  return publicRooms;
}

function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
  console.log(socket);

  socket.nickname = "Anonymous";

  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  socket.on("enter_room", (payload, done) => {
    if (payload.nickname !== "") {
      socket.nickname = payload.nickname;
    }

    socket.join(payload.roomname);
    console.log(socket.rooms);
    done();
    socket
      .to(payload.roomname)
      .emit("welcome", socket.nickname, countRoom(payload.roomname));
    wsServer.sockets.emit("room_change", publicRooms());
  });

  socket.on("disconnecting", () => {
    // socket.leave(msg.payload);
    // console.log(socket.rooms);
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1);
    });
  });

  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });

  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });

  socket.on("nickname", (nickname) => {
    socket.nickname = nickname;
  });
});

// wss.on("connection", (socket) => {
//   console.log("Connected to Browser");
//   socket.nickname = "Anonymous";
//   sockets.push(socket);

//   socket.on("close", () => {
//     console.log("Disconnected from Browser");
//   });

//   socket.on("message", (msg) => {
//     const data = JSON.parse(msg);
//     switch (data.type) {
//       case "message":
//         sockets.forEach((it) => it.send(`${socket.nickname}: ${data.payload}`));
//         console.log(`New message: ${data.payload}`);
//         break;

//       case "nickname":
//         socket.nickname = data.payload;
//         console.log(data.payload);
//         break;
//     }
//   });
// });

// app.listen(3000, handleListen);
httpServer.listen(3000, handleListen);
