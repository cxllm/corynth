"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
const child_process_1 = require("child_process");
module.exports = class extends Command_1.default {
    constructor(client) {
        super("refresh", {
            description: "Refresh the bot's modules.",
            aliases: ["reload"],
            usage: ""
        }, {
            owner: true,
            args: 0,
            permissions: {}
        });
        this.client = client;
    }
    async run(msg) {
        await msg.send("Currently refreshing modules. Please wait...");
        child_process_1.exec(`cd ${process.cwd()} && tsc`, async () => {
            this.client.handleCommands();
            this.client.handleEvents();
            delete require.cache[require.resolve("../../Structs/Util")];
            this.client.Util = new (require("../../Structs/Util")).default(this.client);
            delete require.cache[require.resolve("../../config")];
            ;
            this.client.config = require("../../config").default;
            delete require.cache[require.resolve("../../presets")];
            this.client.presets = require("../../presets");
            await msg.send("Modules refreshed.");
        });
    }
};
