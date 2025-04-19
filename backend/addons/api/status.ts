export const path = "/status";

export function run(_req: Request): Response {
    return new Response(
        "gup (This means that cappabot.com is up)",
    );
}