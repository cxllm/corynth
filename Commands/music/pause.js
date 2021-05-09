const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
const { ShoukakuPlayer } = require("shoukaku");
module.exports = class extends Command {
    constructor() {
        super("pause", {
            help: {
                aliases: [],
                usage: "",
                description: "Pause a song"
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
        if (queue.player.paused) return await msg.reply("The queue is already paused!")
        queue.player.setPaused(true);
        await msg.reply("⏸️ Music Paused")
    }
}