const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("loop", {
            help: {
                aliases: ["repeat"],
                usage: "<queue/q|song/s|off/o>",
                description: "Change the loop setting"
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
        const opt = msg.args[0].toLowerCase();
        let set = "";
        switch (opt) {
            case "q":
            case "queue":
                queue.loop = 2;
                set = "queue"
                break;
            case "s":
            case "song":
                queue.loop = 1;
                set = "song"
                break;
            case "o":
            case "off":
                queue.loop = 0;
                set = "off"
                break;
            default:
                return await msg.reply(client.UsageEmbed(this));

        }
        await msg.reply(`🔁 Loop set to ${set}`)

    }
}