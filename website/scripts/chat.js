console.log("WebSocket chat script loaded.");

const inputField = document.getElementById("inputField");
const messagesField = document.getElementById("messagesField");
const sendButton = document.getElementById("sendButton");
const changeUsernameButton = document.getElementById("changeUsernameButton");

// Set up WebSocket URL
const url = "https://cappabot.com/api/chat";
const wsUrl = url.replace("https://", "wss://").replace("http://", "ws://");
let socket;

// Ping the server to check if it's running
fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error("Server is not running or WebSocket URL is incorrect.");
        }
        console.log("WebSocket server is running.");
    })
    .catch(error => {
        console.error("Error connecting to WebSocket server:", error);
        alert("WebSocket server is not running. Please start the server.");
    });

// Initialize messages set
const messages = new Set();

let username = localStorage.getItem("username") || "anon";

function initializeChat() {
    // Get messages from server
    return fetch(url, { headers: { "Accept": "application/json" } }).then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch messages from server.");
        }
        return response.json();
    }).then(data => {
        console.log("Fetched messages:", data);
        data.forEach(msg => {
            console.log("Adding message:", msg);
            messages.add(msg);
        });
        renderMessages();
    }).catch(error => {
        console.error("Error fetching messages:", error);
        alert("Failed to load messages. Please check the server.");
    });
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
    messagesField.innerHTML = Array.from(messages)
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

// Initialize chat
initializeChat().then(() => {
    // Connect to WebSocket after initial messages are loaded
    connectWebSocket();
});
