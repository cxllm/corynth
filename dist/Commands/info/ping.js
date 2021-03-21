"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("ping", {
            description: "View the bot's latency and response times.",
            aliases: ["latency", "response-time"],
            usage: ""
        }, {
            owner: false,
            args: 0,
            permissions: {}
        });
        this.client = client;
    }
    async run(msg) {
        const m = await msg.send(`Testing Latency`);
        const latency = m.createdTimestamp - msg.createdTimestamp;
        await msg.send("", {
            embed: {
                title: "Bot Latency",
                description: `Message Response Time: \`${latency}ms\`\nDiscord API Heartbeat: \`${this.client.ws.ping}ms\``,
                color: this.client.config.colours.main
            }
        });
    }
};
