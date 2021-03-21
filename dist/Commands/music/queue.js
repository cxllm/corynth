"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("queue", {
            description: "View the queue.",
            aliases: ["q", "np", "nowplaying"],
            usage: ""
        }, {
            owner: false,
            args: 0,
            permissions: {},
            cooldown: "2.5s"
        });
        this.client = client;
    }
    async run(msg) {
        let queue = this.client.queue.get(msg.guild.id);
        if (!queue || !queue.player)
            return await msg.reply(this.client.presets.nothing_playing);
        let song = queue.songs[0];
        let i = 0;
        let embed = {
            title: "Server Queue",
            fields: [
                {
                    name: "Now Playing",
                    value: `[${song.info.title}](${song.info.uri}) by ${song.info.author} - ${song.info.duration}`
                }
            ],
            color: this.client.config.colours.main,
            thumbnail: {
                url: msg.guild.iconURL({
                    dynamic: true
                })
            }
        };
        if (queue.songs.length > 1) {
            embed.fields.push({
                name: "Up Next",
                value: [...queue.songs.map(song => {
                        return `**${i++}** - [${song.info.title}](${song.info.uri}) by ${song.info.author} - ${song.info.duration}`;
                    }).slice(1, 6), queue.songs.length > 6 ? `And ${queue.songs.length - 6} more...` : ""].join("\n")
            });
        }
        await msg.reply({ embed });
    }
};
