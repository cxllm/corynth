"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("meme", {
            description: "View a meme from reddit.",
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
        const { data } = await this.client.web.get("https://api.ksoft.si/images/random-meme", {
            headers: {
                Authorization: `Bearer ${this.client.config.ksoft}`
            }
        });
        let embed = {
            title: data.title,
            image: {
                url: data.image_url,
            },
            url: data.source,
            color: this.client.config.colours.main,
            description: `Subreddit: \`${data.subreddit}\`\n${data.upvotes} 👍 | ${data.downvotes} 👎\nAuthor: \`${data.author}\``,
            footer: {
                text: `Powered by ksoft.si`
            }
        };
        await msg.send({ embed });
    }
};
