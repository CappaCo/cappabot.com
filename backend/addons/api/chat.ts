console.log("chat.ts is running");

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

        return new Response("burger", {
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

    else {
        return new Response("Method not allowed", {
            status: 405,
        });
    }
}