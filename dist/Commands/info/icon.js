"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("icon", {
            description: "View the server icon",
            aliases: [],
            usage: ""
        }, {
            owner: false,
            args: 0,
            permissions: {}
        });
        this.client = client;
    }
    async run(msg) {
        if (!msg.guild.icon)
            return await msg.send("This server does not have an icon!");
        const url = msg.guild.iconURL({ dynamic: true, size: 2048, format: "png" });
        const avatar = {
            png: msg.guild.iconURL({ format: "png" }),
            jpg: msg.guild.iconURL({ format: "jpg" }),
            webp: msg.guild.iconURL({ format: "webp" }),
        };
        const embed = {
            title: `${msg.guild.name}'s Icon`,
            description: Object.keys(avatar).map(i => `[${i}](${avatar[i]})`).join(" | "),
            image: {
                url
            },
            color: this.client.config.colours.main
        };
        return await msg.send({ embed });
    }
};
