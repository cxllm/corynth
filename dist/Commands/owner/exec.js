"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
const child_process_1 = require("child_process");
module.exports = class extends Command_1.default {
    constructor(client) {
        super("exec", {
            description: "Execute a command.",
            aliases: ["execute", "sh", "shell"],
            usage: "<command>"
        }, {
            owner: true,
            args: 1,
            permissions: {}
        });
        this.client = client;
    }
    async run(msg) {
        child_process_1.exec(msg.args.join(" "), async (_, out, stderr) => {
            return await msg.send(`\`\`\`${(out || stderr).substr(0, 1994)}\`\`\``);
        });
    }
};
