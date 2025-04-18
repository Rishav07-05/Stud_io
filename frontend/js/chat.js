const userId = Math.floor(Math.random() * 10000); // Replace with session user ID in real case
const userName = document.getElementById("userName");
if (userName) userName.textContent += ` User${userId}`;

const socket = new WebSocket("ws://localhost:8080"); // Change port if needed

socket.onopen = () => {
  console.log("Connected to WebSocket server");
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.user_id && data.message) {
    addMessage(data.user_id, data.message);
  }
};

function handleChatEnter(event) {
  if (event.key === "Enter") sendChat();
}

function sendChat() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  if (!message || socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify({ user_id: userId, message }));
  input.value = "";
}

function addMessage(user, text) {
  const box = document.getElementById("chatBox");
  const div = document.createElement("div");
  div.className = "mb-2";
  div.innerHTML = `<strong>User ${user}:</strong> ${text}`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
