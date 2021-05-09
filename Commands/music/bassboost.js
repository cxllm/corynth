const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("bassboost", {
            help: {
                aliases: ["bb"],
                usage: "<1 - 10>",
                description: "Change the bassboost of a song"
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
        const bassboost = parseFloat(msg.args[0]);
        if (isNaN(bassboost)) return await msg.reply("Invalid Bassboost Value!");
        if (bassboost > 10 || bassboost < 0) return await msg.reply("Please enter a number between 0 and 10");
        queue.player.setEqualizer(client.Util.eq(bassboost / 10));
        queue.filters.equalizer = client.Util.eq(bassboost / 10);
        await msg.reply(client.presets.filters.replace("[filter]", "Bassboost").replace("[number]", bassboost))

    }
}