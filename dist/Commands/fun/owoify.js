"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("owoify", {
            description: "OwOify some text.",
            aliases: [],
            usage: "<text>"
        }, {
            owner: false,
            args: 1,
            permissions: {}
        });
        this.client = client;
    }
    async run(msg) {
        const text = encodeURIComponent(msg.args.join(" "));
        const { data } = await this.client.web.get(`https://nekos.life/api/v2/owoify?text=${text}`);
        let embed = {
            description: data.owo,
            color: this.client.config.colours.main
        };
        await msg.send({ embed });
    }
};
