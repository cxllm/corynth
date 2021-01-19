const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message, User } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("lock", {
            help: {
                aliases: [],
                usage: "<channel> [reason]",
                description: "Lock a channel"
            },
            config: {
                args: 1,
                permissions: {
                    user: "MANAGE_CHANNELS",
                    bot: "MANAGE_CHANNELS"
                },
                owner: false,
                cooldown: false
            }
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        let channel = msg.mentions.channels.first() || msg.guild.channels.cache.get(msg.args[0]);
        if (!channel) return await msg.reply(client.presets.invalid_channel)
        let reason = msg.args.slice(1).join(" ") || client.presets.no_reason
        await channel.updateOverwrite(msg.guild.id, {
            SEND_MESSAGES: false
        })
        channel.send({
            embed: {
                title: "Channel Locked",
                description: `This channel has been locked by ${msg.author.tag}\nReason: ${reason}`,
                color: client.config.colours.success
            }
        });
    }
}