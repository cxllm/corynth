const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("queue", {
            help: {
                aliases: ["q"],
                usage: "",
                description: "View the server queue"
            },
            config: {
                args: 0,
                permissions: {
                    user: false,
                    bot: false
                },
                owner: false,
                cooldown: "2.5s"
            }
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        let queue = client.queue.get(msg.guild.id)
        if (!queue || !queue.player) return await msg.reply(client.presets.nothing_playing);
        let song = queue.songs[0]
        let i = 0;
        let embed = {
            title: "Server Queue",
            fields: [
                {
                    name: "Now Playing",
                    value: `[${song.info.title}](${song.info.uri}) by ${song.info.author} - ${song.info.duration}`
                }
            ],
            color: client.config.colours.main,
            thumbnail: {
                url: msg.guild.iconURL({
                    dynamic: true
                })
            }
        }
        if (queue.songs.length > 1) {
            embed.fields.push({
                name: "Up Next",
                value: [...queue.songs.map(song => {
                    return `**${i++}** - [${song.info.title}](${song.info.uri}) by ${song.info.author} - ${song.info.duration}`
                }).slice(1, 6), queue.songs.length > 6 ? `And ${queue.songs.length - 6} more...` : ""]
            })
        }
        await msg.reply({ embed })
    }
}