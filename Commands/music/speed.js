const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("speed", {
            help: {
                aliases: [],
                usage: "<0 - 5.0>",
                description: "Change the speed of the player"
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
        let number = parseFloat(msg.args[0]);
        if (isNaN(number)) return await msg.reply(client.UsageEmbed(this));
        if (number > 5 || number < 0) return msg.reply(`Please enter a valid number between 0 and 5`)
        if (number === 0) number = null;
        if (!queue.filters.timescale) queue.filters.timescale = { speed: number };
        else queue.filters.timescale.speed = number;
        await queue.player.setGroupedFilters(queue.filters);
        await msg.reply(client.presets.filters.replace("[filter]", "Speed").replace("[number]", number ?? 1))

    }
}