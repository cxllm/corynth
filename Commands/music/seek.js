const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
const ms = require("ms");
module.exports = class extends Command {
    constructor() {
        super("seek", {
            help: {
                aliases: [],
                usage: "<time>",
                description: "Seek forward in a song"
            },
            config: {
                args: 1,
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
        if (!msg.member.voice.channel || msg.member.voice.channel.id != queue.voice.id) return await msg.reply(client.presets.not_queue_vc);
        if (queue.player.paused) return await msg.reply("The queue is currently paused!")
        let milleseconds = null;
        for (const arg of msg.args) {
            if (!milleseconds) milleseconds = ms(arg)
            else milleseconds += ms(arg)
        }
        if (!milleseconds && milleseconds !== 0) return await msg.reply("Please provide your time in a format like this: `1m 30s`");
        if (milleseconds > queue.songs[0].info.length || 0 > milleseconds) return await msg.reply("Please provide a valid time within the song.");
        queue.player.seekTo(milleseconds);
        await msg.reply(`⏩ Seeked to ${client.Util.timestamp(milleseconds)}`);

    }
}