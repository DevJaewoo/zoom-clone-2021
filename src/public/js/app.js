const socket = io();
const welcome = document.querySelector("#welcome");
const welcomeForm = welcome.querySelector("form");

const room = document.querySelector("#room");

let roomName = "";

room.hidden = true;

function addMessage(message) {
  const ul = room.querySelector("ul");
  li = document.createElement("li");
  li.innerText = message;
  ul.append(li);
}

function setTitle(title) {
  const h3 = room.querySelector("h3");
  h3.innerText = title;
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;

  setTitle(`Room ${roomName}`);

  const nicknameForm = room.querySelector("#nickname");
  const messageForm = room.querySelector("#message");

  nicknameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = nicknameForm.querySelector("input");
    socket.emit("nickname", input.value);
    input.value = "";
  });

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    const message = input.value;
    socket.emit("new_message", input.value, roomName, () => {
      addMessage(`You: ${message}`);
    });
    input.value = "";
  });
}

welcomeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const roomnameInput = welcomeForm.querySelector("input.roomname_input");
  const nicknameInput = welcomeForm.querySelector("input.nickname_input");
  socket.emit(
    "enter_room",
    { roomname: roomnameInput.value, nickname: nicknameInput.value },
    showRoom
  );
  roomName = roomnameInput.value;
  roomnameInput.value = "";
});

socket.on("welcome", (nickname, newCount) => {
  setTitle(`Room ${roomName} (${newCount})`);
  addMessage(`${nickname} has joined the channel!`);
});

socket.on("bye", (nickname, newCount) => {
  setTitle(`Room ${roomName} (${newCount})`);
  addMessage(`${nickname} has left the channel!`);
});

socket.on("new_message", (message) => {
  addMessage(message);
});

socket.on("room_change", (rooms, newCount) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});

// const messageList = document.querySelector("ul");
// const messageForm = document.querySelector("#message");
// const messageInput = messageForm.querySelector("input");
// const nicknameForm = document.querySelector("#nickname");
// const nicknameInput = nicknameForm.querySelector("input");
// const socket = new WebSocket(`ws://${window.location.host}`);

// function addMessage(message) {
//   const li = document.createElement("li");
//   li.innerText = message;
//   messageList.appendChild(li);
// }

// function makeMessage(type, payload) {
//   const msg = { type, payload };
//   console.dir(msg);
//   return JSON.stringify(msg);
// }

// socket.addEventListener("open", () => {
//   console.log("Connected to Server");
//   addMessage("Connected to Server");
// });

// socket.addEventListener("message", (message) => {
//   console.log(`New message: ${message.data}`);
//   addMessage(`${message.data}`);
// });

// socket.addEventListener("close", () => {
//   console.log("Disconnected from Server");
//   addMessage("Disconnected from Server");
// });

// messageForm.addEventListener("submit", (event) => {
//   event.preventDefault();
//   socket.send(makeMessage("message", messageInput.value));
//   messageInput.value = "";
// });

// nicknameForm.addEventListener("submit", (event) => {
//   event.preventDefault();
//   socket.send(makeMessage("nickname", nicknameInput.value));
//   nicknameInput.value = "";
// });
