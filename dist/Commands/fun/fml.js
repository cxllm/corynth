"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("fml", {
            description: "See an \"FML\" story.",
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
        const { data } = await this.client.web.get("https://api.alexflipnote.dev/fml", {
            headers: {
                'Authorization': this.client.config.afn
            }
        });
        let embed = {
            title: `FML Story`,
            color: this.client.config.colours.main,
            description: `${data.text}`,
        };
        await msg.send({ embed });
    }
};
