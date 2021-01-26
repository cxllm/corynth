const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("token-remover", {
            help: {
                aliases: [],
                usage: "<on|off>",
                description: "Prevent tokens from being leaked"
            },
            config: {
                args: 1,
                permissions: {
                    user: "MANAGE_GUILD",
                    bot: false
                },
                owner: false,
                cooldown: "2s"
            }
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        let arg = msg.args[0].toLowerCase();
        switch (arg) {
            case "on":
                msg.guild.options.token = true;
                await client.db.Guilds.set(msg.guild.id, msg.guild.options);
                await msg.reply(`${client.config.emojis.tick} Token remover turned on!`)
                break;
            case "off":
                msg.guild.options.token = null;
                await client.db.Guilds.set(msg.guild.id, msg.guild.options);
                await msg.reply(`${client.config.emojis.tick} Token remover turned off`)
                break;
            default:
                await msg.reply(client.UsageEmbed(this));
                break;
        }
    }
}