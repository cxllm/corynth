const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("resume", {
            help: {
                aliases: [],
                usage: "",
                description: "Resume a song"
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
        if (!msg.member.voice.channel || msg.member.voice.channel.id != queue.voice.id) return await msg.reply(client.presets.not_queue_vc);
        if (!queue.player.paused) return await msg.reply("The queue is already playing!")
        queue.player.setPaused(false);
        await msg.reply("⏸️ Music Resumed")
    }
}