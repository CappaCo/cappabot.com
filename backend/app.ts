import { walk } from "@std/fs";
import mime from "npm:mime";

const messages: string[] = [];

// This function returns the filepath of a file in the website directory
// It allows html pages to be found without the need to add .html in the URL
async function getTheFile(filePath: string): Promise<string> {
    // The / path returns index.html
    if (filePath == "/") return "/index.html";

    // Get all of the files in the website directory
    const filePaths = [];
    for await (const walkEntry of walk("./website")) {
        // Only add files to the filePaths array
        if (walkEntry.isFile) {
            filePaths.push(
                // Remove "website" from the path
                walkEntry.path.replaceAll("\\", "/").replace("website", ""),
            );
        }
    }

    // If we add .html to the requested filePath, is it found in filePaths?
    // If so, return that file with the .html extension
    if (filePaths.includes(filePath + ".html")) return filePath + ".html";

    // If the file is found then return that file
    if (filePaths.includes(filePath)) return filePath;

    // If no files are found, return the 404 page
    return "/404.html";
}

// API requests are to cappabot.com/api/*
async function apiRequest(req: Request): Promise<Response> {
    const reqMethod = req.method;
    const reqURL = new URL(req.url);
    let reqPath = reqURL.pathname.replace("/api", "");

    // If it's a status request
    if (reqPath.startsWith("/status")) {
        // Make sure it's a get request
        if (reqMethod == "GET") {
            // Remove status from the URL
            reqPath = reqPath.replace("/status", "");

            // There could be a whole bunch of statuses for each service on cappabot.com

            // If there is no status path, say cappabot.com is up
            return new Response(
                "gup (This means that cappabot.com is up)",
            );
        } else return new Response('Only "GET" to /api/status pls');
    }

    else if (reqPath.startsWith("/chat")) {
        if (reqMethod == "POST") {
            const data = await req.text();
            console.log(data);

            if (messages.unshift(data) > 10) messages.splice(10 - messages.length);

            return new Response("burger");
        }

        else if (reqMethod == "GET") {
            return new Response(JSON.stringify(messages));
        }

        return new Response("yeah nah");
    }

    // Pretty much a 404 for api requests
    return new Response(`API request to ${reqPath} could not be resolved`, {
        status: 404,
    });
}

// Handle requests to the website part of cappabot.com
async function websiteRequest(req: Request): Promise<Response> {
    const reqURL = new URL(req.url);
    const reqPath = reqURL.pathname;

    const reqFilePath = decodeURIComponent(reqPath);

    // Get the file
    const resFileName = await getTheFile(reqFilePath);
    // If it's the 404 page, the status also needs to be a 404
    const resStatus = resFileName == "404.html" ? 404 : 200;

    // Open the file with deno
    const file = await Deno.open("./website" + resFileName);
    // Get the mime type from the file name
    const contentType = mime.getType(resFileName);
    // If a mime type was found, set the content-type header to that, otherwise the type is text/plain
    const headers = new Headers({
        "content-type": contentType || "text/plain",
    });
    // Return the response with the status and the headers
    return new Response(file.readable, { status: resStatus, headers: headers });
}

// Handle all requests to cappabot.com
async function handler(req: Request) {
    const reqMethod = req.method;
    const reqURL = new URL(req.url);
    const reqPath = reqURL.pathname;

    // API requests
    if (reqPath.startsWith("/api")) return apiRequest(req);

    // If the request method is GET
    if (reqMethod == "GET") {
        // Get parts of the website
        return await websiteRequest(req);
    } else {
        // Otherwise it's a bad request
        return new Response("Yeah idk", { status: 400 });
    }
}

// Serve with deno
Deno.serve(handler);
