console.log("chat.ts loaded");

type ChatMessage = {
    user: string;
    timestamp: number;
    message: string;
};

const messages = new Set<ChatMessage>();
const clients = new Set<WebSocket>();

const messageLimit = 10;

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export const path = "/chat";

function addMessage(message: ChatMessage) {
    messages.add(message);
    while (messages.size > messageLimit) {
        const oldestMessage = messages.values().next().value;
        if (oldestMessage) {
            messages.delete(oldestMessage);
        }
    }
    broadcastMessage(message);
}

function broadcastMessage(message: ChatMessage) {
    for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    }
}

export async function run(req: Request): Promise<Response> {
    const reqMethod = req.method;

    // Handle WebSocket upgrade requests
    const upgradeHeader = req.headers.get("upgrade") || "";
    if (upgradeHeader.toLowerCase() === "websocket") {
        const { socket, response } = Deno.upgradeWebSocket(req);

        socket.onopen = () => {
            console.log("WebSocket connection opened");
            clients.add(socket);
        };

        socket.onmessage = (event) => {
            const json = JSON.parse(event.data);

            const message: ChatMessage = {
                user: json.user || "anon",
                timestamp: Date.now(),
                message: json.message || "",
            };

            addMessage(message);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
            clients.delete(socket);
        };

        socket.onerror = (err) => {
            console.error("WebSocket error:", err);
            clients.delete(socket);
        };

        return response;
    }

    // Handle non-WebSocket requests
    if (reqMethod == "POST") {
        const data = await req.text();
        let message: ChatMessage | undefined;
        let responseMessage = "Message accepted";

        try {
            // Try JSON first
            const json = JSON.parse(data);
            if (typeof json === "object" && json !== null && "message" in json) {
                message = {
                    user: json.user || "anon",
                    timestamp: Date.now(),
                    message: json.message || "",
                };
            }
        } catch {
            // Fallback to "user: message" format
            const parts = data.split(": ");
            if (parts.length >= 2) {
                message = {
                    user: parts[0] || "anon",
                    timestamp: Date.now(),
                    message: parts.slice(1).join(": ") || "",
                };
            } else {
                responseMessage = "Invalid message format. Use JSON or 'user: message'.";
            }
        }

        if (message) {
            addMessage(message);
        }

        return new Response(responseMessage, {
            headers: {
                ...corsHeaders,
            }
        });
    } else if (reqMethod == "GET") {
        // Check header for if the request wants json or text
        const acceptHeader = req.headers.get("accept") || "";
        let responseJSON;
        console.log("Accept header:", acceptHeader);
        if (acceptHeader.includes("application/json")) {
            responseJSON = Array.from(messages).sort((a, b) => a.timestamp - b.timestamp);
        } else {
            responseJSON = Array.from(messages).sort((a, b) => a.timestamp - b.timestamp)
                .map(msg => `${msg.user}: ${msg.message}`)
                .reverse(); // Reverse to show latest messages first
        }
        return new Response(JSON.stringify(responseJSON), {
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
            },
        });
    } else if (reqMethod == "OPTIONS") {
        return new Response(null, {
            headers: {
                "Allow": "GET, POST, OPTIONS",
                ...corsHeaders,
            },
        });
    } else {
        return new Response("Method not allowed", {
            status: 405,
        });
    }
}
