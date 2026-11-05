/**
 * Riz — Portfolio Chatbot Frontend
 */

const chatEl = document.getElementById("chat");
const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const suggestions = document.getElementById("suggestions");

// Conversation history sent to the backend
let history = [];

// ── Helpers ────────────────────────────────────────────────

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/** Very light markdown → HTML (bold, lists, links, code) */
function formatMarkdown(text) {
  let html = escapeHtml(text);

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Links
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>'
  );

  // Simple URLs
  html = html.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener">$1</a>'
  );

  // Unordered lists
  html = html.replace(/(?:^|\n)[\-\*] (.+)/g, "\n• $1");

  // Line breaks
  html = html.replace(/\n/g, "<br>");

  return html;
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    chatEl.scrollTop = chatEl.scrollHeight;
  });
}

function addMessage(role, content, isTyping = false) {
  const msg = document.createElement("div");
  msg.className = `message ${role}${isTyping ? " typing" : ""}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar-sm";
  avatar.textContent = role === "bot" ? "R" : "U";

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  if (isTyping) {
    bubble.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
  } else {
    bubble.innerHTML = formatMarkdown(content);
  }

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  chatEl.appendChild(msg);
  scrollToBottom();
  return msg;
}

function showWelcome() {
  chatEl.innerHTML = `
    <div class="welcome">
      <h2>Hey, I'm Riz 👋</h2>
      <p>
        Abdullah Rizwan's AI assistant. Ask me about his experience,
        skills, projects, services, or how to get in touch.
      </p>
    </div>
  `;
}

// ── API Call ───────────────────────────────────────────────

async function sendMessage(text) {
  // Hide suggestions after first message
  suggestions.style.display = "none";

  // Add user message
  addMessage("user", text);
  history.push({ role: "user", content: text });

  // Show typing indicator + temporarily disable input
  const typingMsg = addMessage("bot", "", true);
  sendBtn.disabled = true;
  input.disabled = true;

  let shouldEndChat = false;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history }),
    });

    const data = await res.json();

    // Remove typing indicator
    typingMsg.remove();

    if (data.error) {
      addMessage("bot", `⚠️ ${data.error}`);
    } else {
      const reply = data.reply || "Sorry, I didn't get a response.";
      addMessage("bot", reply);
      history.push({ role: "assistant", content: reply });

      // Only end chat when backend explicitly says so (goodbye / bye etc.)
      if (data.end_chat === true) {
        shouldEndChat = true;
      }
    }
  } catch (err) {
    typingMsg.remove();
    addMessage(
      "bot",
      "⚠️ Could not reach the server. Make sure the backend is running on port 5000."
    );
  } finally {
    if (shouldEndChat) {
      // Permanently disable input until user clears the chat
      input.disabled = true;
      sendBtn.disabled = true;
      input.placeholder = "Conversation ended. Click the trash icon to restart.";

      const endedNotice = document.createElement("div");
      endedNotice.className = "welcome";
      endedNotice.style.marginTop = "12px";
      endedNotice.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">Chat ended. Click the trash icon above to start a new conversation.</p>`;
      chatEl.appendChild(endedNotice);
      scrollToBottom();
    } else {
      // Normal case → re-enable input so user can continue chatting
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }
}

// ── Event Listeners ────────────────────────────────────────

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  sendMessage(text);
});

clearBtn.addEventListener("click", () => {
  history = [];
  showWelcome();
  suggestions.style.display = "flex";

  // Always re-enable input after clearing (even if chat was ended)
  input.disabled = false;
  sendBtn.disabled = false;
  input.placeholder = "Ask me anything about Abdullah...";
  input.focus();
});

// Suggestion chips
suggestions.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    sendMessage(chip.textContent);
  });
});

// ── Init ───────────────────────────────────────────────────
showWelcome();
input.focus();