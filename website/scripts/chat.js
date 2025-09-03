console.log("Chat script loaded.");
console.log("Use \"enableSanitization = false\" to disable DOMPurify sanitization.");

const inputField = document.getElementById("inputField");
const messagesField = document.getElementById("messagesField");
const sendButton = document.getElementById("sendButton");
const changeUsernameButton = document.getElementById("changeUsernameButton");

const notificationsEnabledSwitch = document.getElementById("notificationsEnabledSwitch");

// Set up WebSocket URL
const url = "/api/chat";
const wsUrl = url.replace("https://", "wss://").replace("http://", "ws://");
let socket;

// deno-lint-ignore prefer-const
let enableSanitization = true; // Enable DOMPurify by default

// Initialize messages set
const messages = new Set();

let username = localStorage.getItem("username") || "anon";
let notificationsEnabled = localStorage.getItem("notificationsEnabled") === "true";

async function initializeChat() {
    // Get messages from server
    try {
        const response = await fetch(url, { headers: { "Accept": "application/json" } });
        if (!response.ok) {
            throw new Error("Failed to fetch messages from server.");
        }
        const data = await response.json();
        data.forEach(msg => {
            messages.add(msg);
        });
        renderMessages();
    } catch (error) {
        console.error("Error fetching messages:", error);
        alert("Failed to load messages. Please check the server.");
    }
}

function connectWebSocket() {
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        messages.add(message);
        renderMessages();
        sendMessageNotification(message);
    };

    socket.onclose = () => {
        console.warn("WebSocket disconnected. Reconnecting in 3s...");
        setTimeout(connectWebSocket, 3000);
    };

    socket.onerror = (err) => {
        console.error("WebSocket error:", err);
    };
}

function sendMessage() {
    const message = inputField.value.trim();
    if (!message) return;

    const fullMessage = JSON.stringify({
        "user": username,
        "message": message,
        "timestamp": Date.now(),
    });

    socket.send(fullMessage);

    inputField.value = "";
}

function renderMessages() {
    if (messages.size === 0) {
        messagesField.innerHTML = "<em>No messages...</em>";
        return;
    }

    // Sort messages by timestamp and format them
    const dirtyMessages = Array.from(messages)
        .sort((a, b) => {
            return a.timestamp - b.timestamp;
        })
        .map((msg) => {
            const timestamp = `<span class="timestamp">(${new Date(msg.timestamp).toLocaleTimeString()})</span>`;
            const user = `<strong>${msg.user}</strong>`;
            const message = msg.message;
            return `${timestamp} ${user}: ${message}`;
        })
        .join("<br>");
    
    // Sanitize the messages to prevent XSS attacks
    messagesField.innerHTML = enableSanitization ? DOMPurify.sanitize(dirtyMessages) : dirtyMessages;
    console.log("Removed:", DOMPurify.removed);
}

function sendMessageNotification(message) {
    if (!notificationsEnabled) return;
    if (username == message.user) return;
    console.log("sending notification for message:", message);
    const notification = new Notification("New message in CappaChat", {
        body: `Sent by ${message.user}`,
    });
}

function changeUsername() {
    const newUsername = prompt("Enter your new username:", username);
    if (newUsername && newUsername.trim() !== "") {
        localStorage.setItem("username", newUsername);
        username = newUsername;
    }
}

// Set event listeners
inputField.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

sendButton.addEventListener("click", sendMessage);
changeUsernameButton.addEventListener("click", changeUsername);
notificationsEnabledSwitch.addEventListener("change", (event) => {
    console.log("notification input changed");
    notificationsEnabled = event.target.checked;
    if (notificationsEnabled) {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }

    localStorage.setItem("notificationsEnabled", notificationsEnabled);
});

// Initialize chat
initializeChat().then(
    // Connect to WebSocket after initial messages are loaded
    connectWebSocket
);
