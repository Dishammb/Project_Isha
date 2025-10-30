// === DOM elements ===
const chatWindow = document.getElementById("chat-window");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

// === Conversation variables ===
let context = "";
let userName = "";

// === Helper: Add message bubble to chat window ===
function appendMessage(who, text) {
  const container = document.createElement("div");
  container.className = `msg ${who === "you" ? "you" : "bot"}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  const label = document.createElement("div");
  label.className = "label";
  label.textContent = who === "you" ? "You" : "Isha";

  container.appendChild(bubble);
  container.appendChild(label);
  chatWindow.appendChild(container);

  // auto-scroll to bottom
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// === Start the chatbot ===
function startChat() {
  appendMessage("bot", "Hello! I'm Isha 🤖. What would you like me to call you?");
}

// === Handle user's first input (name) ===
function handleNameResponse(name) {
  userName = name || "User";
  appendMessage("bot", `Nice to meet you, ${userName}! How can I help you today? 😊`);
}

// === Send message to backend ===
async function sendMessage(text) {
  // If user hasn’t introduced themselves yet
  if (!userName) {
    handleNameResponse(text);
    return;
  }

  // Add user's message to chat window
  appendMessage("you", text);

  // Update conversation context
  context += `\n${userName}: ${text}\nAI: `;

  // Build request payload
  const payload = { context, question: text };

  // Show "typing…" bubble
  const typingBubble = document.createElement("div");
  typingBubble.className = "msg bot";
  typingBubble.innerHTML = `<div class="bubble">Typing…</div><div class="label">Isha</div>`;
  chatWindow.appendChild(typingBubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    chatWindow.removeChild(typingBubble);

    if (res.ok && data.reply) {
      appendMessage("bot", data.reply);
      context += data.reply;
    } else {
      const errorMsg = data.error || "Server error";
      appendMessage("bot", `Error: ${errorMsg}`);
      context += `Error: ${errorMsg}`;
    }
  } catch (err) {
    chatWindow.removeChild(typingBubble);
    appendMessage("bot", `Network error: ${err.message}`);
    context += `Network error: ${err.message}`;
  }
}

// === Event listeners ===
sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  sendMessage(text);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendBtn.click();
  }
});

// === Initialize chatbot on page load ===
startChat();
input.focus();
