"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("clearcache", {
            description: "Clear the bot's cache.",
            aliases: ["cc"],
            usage: ""
        }, {
            owner: true,
            args: 0,
            permissions: {}
        });
        this.client = client;
    }
    async run(msg) {
        await msg.send("Currently clearing cache. Please wait...");
        this.client.users.cache.clear();
        this.client.db.guilds.clearCache();
        await msg.send("Cache cleared");
    }
};
