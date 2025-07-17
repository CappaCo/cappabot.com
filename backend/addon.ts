export class Addon {

    fileName: string;
    path: string | undefined;

    constructor(fileName: string) {
        this.fileName = fileName;
        this.load();
    }

    async load() {
        const addonImport = await import("./addons/" + this.fileName);

        this.checkRequirements(addonImport);

        this.run = addonImport.run;
        this.path = this.fileName.split("/").slice(0, -1).join("/") + addonImport.path;
        console.log(`Addon loaded: ${this.fileName} at path ${this.path}`);
    }

    private checkRequirements(addonImport: Record<string, unknown>) {
        const requiredStuff = ["run", "path"];

        for (const name of requiredStuff) {
            if (typeof addonImport[name] === "undefined") {
                throw new Error(`function '${name}' not found in ${this.fileName}`);
            }
        }
    }

    run(_req: Request): Response | Promise<Response> {
        console.log("run function not set yet");
        return new Response("server is being lazy, just wait a sec");
    }
}