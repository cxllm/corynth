"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("avatar", {
            description: "View your own or another user's avatar.",
            aliases: ["av", "pfp"],
            usage: "[user]"
        }, {
            owner: false,
            args: 0,
            permissions: {}
        });
        this.client = client;
    }
    async run(msg) {
        const { user } = await this.client.Util.getMember(msg);
        const url = user.displayAvatarURL({ dynamic: true, size: 2048, format: "png" });
        const avatar = {
            png: user.displayAvatarURL({ format: "png" }),
            jpg: user.displayAvatarURL({ format: "jpg" }),
            webp: user.displayAvatarURL({ format: "webp" }),
        };
        const embed = {
            title: `${user.tag}'s Avatar`,
            description: Object.keys(avatar).map(i => `[${i}](${avatar[i]})`).join(" | "),
            image: {
                url
            },
            color: this.client.config.colours.main
        };
        return await msg.send({ embed });
    }
};
