const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
  console.log("Connected to WebSocket server");
  socket.send(JSON.stringify({ type: "join", msg: "A new user has joined!" }));
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "message") {
    addMessage(data.msg);
  } else if (data.type === "emoji") {
    showEmoji(data.emoji);
  } else if (data.type === "join") {
    addMessage("🔔 " + data.msg);
  }
};

socket.onclose = () => {
  console.log("Disconnected from server");
};

document.getElementById("sendBtn").addEventListener("click", () => {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (msg) {
    socket.send(JSON.stringify({ type: "message", msg }));
    input.value = "";
  }
});

document.querySelectorAll(".emoji-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const emoji = btn.textContent;
    socket.send(JSON.stringify({ type: "emoji", emoji }));
  });
});

function addMessage(msg) {
  const chatBox = document.getElementById("chatBox");
  const div = document.createElement("div");
  div.className = "p-2 bg-gray-100 my-1 rounded";
  div.textContent = msg;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showEmoji(emoji) {
  const emojiDiv = document.createElement("div");
  emojiDiv.className = "absolute top-4 right-4 text-4xl animate-bounce z-50";
  emojiDiv.textContent = emoji;
  document.body.appendChild(emojiDiv);
  setTimeout(() => emojiDiv.remove(), 3000);
}
