console.log("status.ts loaded");

// Generate a random number
const randomNumber = Math.random();

export const path = "/status";

export function run(_req: Request): Response {
    return new Response(
        `gup (This means that cappabot.com is up)\nHere's a random number: ${randomNumber}`,
    );
}