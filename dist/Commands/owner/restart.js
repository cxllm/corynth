"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("restart", {
            description: "Restart the bot.",
            aliases: ["reboot"],
            usage: "<command>"
        }, {
            owner: true,
            args: 1,
            permissions: {}
        });
        this.client = client;
    }
    async run(msg) {
        await msg.send("Restarted");
        process.exit();
    }
};
