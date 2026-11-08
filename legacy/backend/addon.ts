export class Addon {
    fileName: string;
    type?: string;
    path?: string;

    constructor(fileName: string) {
        this.fileName = fileName;
        this.type = "";
        this.load();
    }

    async load() {
        const addonImport = await import("./addons/" + this.fileName);
        //console.log("loading filename: " + this.fileName);

        this.checkRequirements(addonImport);

        this.run = addonImport.run;
        this.loadvars(addonImport);
    }

    loadvars(addonImport: Record<string, unknown>) {
        this.type = String(addonImport.addonType || "request");
        this.path = this.fileName.replace("\\", "/").split("/").slice(0, -1).join("/") + addonImport.path;
        console.log("Addon loaded:", this.fileName, "Type:", this.type, "Path:", this.path);
    }

    private checkRequirements(addonImport: Record<string, unknown>) {
        const requiredStuff = ["run"];

        for (const name of requiredStuff) {
            if (typeof addonImport[name] === "undefined") {
                throw new Error(`function '${name}' not found in ${this.fileName}`);
            }
        }
    }

    check(_: string): boolean {
        return false;
    }

    // deno-lint-ignore no-explicit-any
    run(..._params: any[]): Response | any | Promise<Response | any> {
        console.log("run function not set yet");
        return new Response("server is being lazy, just wait a sec");
    }
}