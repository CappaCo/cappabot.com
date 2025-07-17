console.log("WebSocket chat script loaded.");

const inputField = document.getElementById("inputField");
const messagesField = document.getElementById("messagesField");
const sendButton = document.getElementById("sendButton");
const changeUsernameButton = document.getElementById("changeUsernameButton");

// Set up WebSocket URL
const url = "https://cappabot.com/api/chat";
const wsUrl = url.replace("https://", "ws://").replace("http://", "ws://");
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
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch messages from server.");
        }
        return response.json();
    }).then(data => {
        data.forEach(msg => {
            messages.add(JSON.stringify(msg));
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
        const json = event.data;
        messages.add(json);
        renderMessages();
    };

    socket.onclose = () => {
        console.warn("WebSocket disconnected. Reconnecting in 2s...");
        setTimeout(connectWebSocket, 2000);
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

    // Show your own message immediately
    messages.add(fullMessage);
    renderMessages();

    inputField.value = "";
}

function renderMessages() {
    if (messages.size === 0) {
        messagesField.innerHTML = "<em>No messages...</em>";
        return;
    }
    messagesField.innerHTML = Array.from(messages)
        .sort((a, b) => {
            const aTime = JSON.parse(a).timestamp;
            const bTime = JSON.parse(b).timestamp;
            return aTime - bTime;
        })
        .map((msg) => {
            const parsedMsg = JSON.parse(msg);
            const timestamp = `<span class="timestamp">(${new Date(parsedMsg.timestamp).toLocaleTimeString()})</span>`;
            const user = `<strong>${parsedMsg.user}</strong>`;
            const message = parsedMsg.message;
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
