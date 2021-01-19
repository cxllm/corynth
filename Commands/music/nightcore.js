const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("nightcore", {
            help: {
                aliases: [],
                usage: "<on/off>",
                description: "Change the nightcore filter of the player"
            },
            config: {
                args: 1,
                permissions: {
                    user: false,
                    bot: false
                },
                owner: false,
                cooldown: "2.5s",
                filter: true
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
        let arg = msg.args.shift().toLowerCase();
        if (arg == "on") {
            queue.filters.timescale = { pitch: 1.25, speed: 1.05 };
        } else if (arg == "off") {
            queue.filters.timescale = null;

        } else return await msg.reply(client.UsageEmbed(this));
        await queue.player.setGroupedFilters(queue.filters);
        await msg.reply(client.presets.filters.replace("[filter]", "Nightcore").replace("[number]", arg))

    }
}