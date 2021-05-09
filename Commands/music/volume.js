const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("volume", {
            help: {
                aliases: ["v"],
                usage: "<1 - 500>",
                description: "Change the volume of a song"
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
        const volume = parseInt(msg.args[0]);
        if (isNaN(volume)) return await msg.reply("Invalid Volume!");
        if (volume > 500 || volume < 1) return await msg.reply("Please enter a number between 1 and 500");
        queue.filters.volume = volume / 100;
        queue.player.setVolume(volume / 100);
        await msg.reply(client.presets.filters.replace("[filter]", "Volume").replace("[number]", `${volume}%`))
    }
}