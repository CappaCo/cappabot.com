console.log("chat.ts is running");

const messages: Array<string> = [];

export const path = "/chat";

export function run(req: Request): Response {
    const reqMethod = req.method;

    if (reqMethod == "POST") {
        req.text().then((data) => {
            console.log(data);

            if (messages.unshift(data) > 10) messages.splice(10 - messages.length);

            return new Response("burger");
        });
    }

    else if (reqMethod == "GET") {
        return new Response(JSON.stringify(messages), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        });
    }

    return new Response("yeah nah");
}