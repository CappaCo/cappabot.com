console.log("chat.ts loaded");

const messages: Array<string> = [];

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

export const path = "/chat";

export async function run(req: Request): Promise<Response> {
    const reqMethod = req.method;

    if (reqMethod == "POST") {
        const data = await req.text();

        if (messages.unshift(data) > 10) messages.splice(10 - messages.length);

        return new Response("Message accepted", {
            headers: {
                ...corsHeaders,
            }
        });
    }

    else if (reqMethod == "GET") {
        return new Response(JSON.stringify(messages), {
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
            }
        });
    }

    else if (reqMethod == "OPTIONS") {
        return new Response(null, {
            headers: {
                "Allow": "GET, POST, OPTIONS",
                ...corsHeaders,
            }
        });
    }

    else {
        return new Response("Method not allowed", {
            status: 405,
        });
    }
}