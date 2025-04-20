const inputField = document.getElementById("inputField");
const messagesField = document.getElementById("messagesField");
const sendButton = document.getElementById("sendButton");
const changeUsernameButton = document.getElementById("changeUsernameButton");

const serverUrl = "https://cappabot.com/api/chat";

let username = localStorage.getItem("username") || "anon";
let previousMessages = [];

console.log("Chat script loaded.");

function sendMessage() {
    let message = inputField.value;

    if (message.trim() === "") return;

    message = username + ": " + message;

    fetch(serverUrl, {
        method: "POST",
        body: message
    })
    .then(response => {
        if (!response.ok) {
            console.error("Failed to send message: ", response.statusText);
        }
        updateMessages();
    })
    .catch(error => {
        console.error("Error sending message:", error);
    });

    inputField.value = "";
}

function updateMessages() {
    fetch(serverUrl)
        .then(response => {
            if (!response.ok) {
                console.error("Failed to fetch messages: ", response.statusText);
                return [];
            }
            return response.json();
        })
        .then(messages => {
            if (messages.toString() == previousMessages.toString()) {
                return;
            }
            previousMessages = messages.slice();
            messagesField.innerHTML = messages.reverse().join("<br>");
        })
        .catch(error => {
            console.error("Error fetching messages: ", error);
        });
}

function changeUsername() {
    const newUsername = prompt("Enter your new username:", username);
    if (newUsername && newUsername.trim() !== "") {
        localStorage.setItem("username", newUsername);
        username = newUsername;
    }
}

updateMessages();
setInterval(updateMessages, 1000);

messagesField.parentElement.ariaBusy = null;

sendButton.addEventListener("click", () => {
    sendMessage();
});

inputField.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

changeUsernameButton.addEventListener("click", () => {
    changeUsername();
});