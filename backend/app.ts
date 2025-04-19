import { walk } from "@std/fs/walk";
import mime from "npm:mime";

console.log("loading addons");

let addonsEnabled = false;
const dirContents = Deno.readDir("./backend/");
for await (const dirEntry of dirContents) {
    if (dirEntry.isDirectory && dirEntry.name == "addons") {
        console.log("addons folder found");
        addonsEnabled = true;
    }
}

if (!addonsEnabled) console.log("addons folder not found");

class Addon {

    fileName: string;
    path: string;

    constructor(fileName: string) {
        this.fileName = fileName;
        this.path = "";
        console.log("Creating new addon with filename: " + this.fileName);
        
        this.load();
    }

    async load() {
        try {
            const addonImport = await import("./addons/" + this.fileName);

            this.checkRequirements(addonImport);

            this.run = addonImport.run;
            this.path = this.fileName.split("/").slice(0, -1).join("/") + addonImport.path;
            console.log("path: " + this.path);
        } catch (_err) {
            console.log("addons don't work");
        }
    }

    private checkRequirements(addonImport: any) {
        const requiredStuff = ["run", "path"];

        for (const name of requiredStuff) {
            if (typeof addonImport[name] === "undefined") {
                throw new Error(`function '${name}' not found in ${this.fileName}`);
            }
        }
    }

    run(_req: Request): Response {
        console.log("run function not set yet");
        return new Response("server is being lazy, just wait a sec");
    }
}

const addons: Array<Addon> = [];
if (addonsEnabled) {
    const addonsDirectory = "backend/addons/";
    const addonsFiles = walk("./" + addonsDirectory);
    for await (const addonsFile of addonsFiles) {
        if (addonsFile.isFile) {
            addons.push(new Addon("/" + addonsFile.path.slice(addonsDirectory.length)));
        }
    }
}

// This function returns the filepath of a file in the website directory
// It allows html pages to be found without the need to add .html in the URL
// It will fallback to the 404 page if the file is not found
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

    console.log("reqPath: " + reqPath);

    // Check addons for the request
    if (addonsEnabled) {
        console.log("searching in addons");
        for (const addon of addons) {
            const validPaths = [addon.path, addon.path + "/"];
            if (validPaths.includes(reqPath)) {
                console.log("found: " + addon.path);
                return addon.run(req);
            }
        }
    }

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
