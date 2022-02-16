const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const messageInput = messageForm.querySelector("input");
const nicknameForm = document.querySelector("#nickname");
const nicknameInput = nicknameForm.querySelector("input");
const socket = new WebSocket(`ws://${window.location.host}`);

function addMessage(message) {
  const li = document.createElement("li");
  li.innerText = message;
  messageList.appendChild(li);
}

function makeMessage(type, payload) {
  const msg = { type, payload };
  console.dir(msg);
  return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
  console.log("Connected to Server");
  addMessage("Connected to Server");
});

socket.addEventListener("message", (message) => {
  console.log(`New message: ${message.data}`);
  addMessage(`${message.data}`);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server");
  addMessage("Disconnected from Server");
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  socket.send(makeMessage("message", messageInput.value));
  messageInput.value = "";
});

nicknameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  socket.send(makeMessage("nickname", nicknameInput.value));
  nicknameInput.value = "";
});
