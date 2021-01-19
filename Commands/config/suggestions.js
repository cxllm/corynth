const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message, WebhookClient } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("suggestions", {
            help: {
                aliases: [],
                usage: "<on|off>",
                description: "Change the guild suggestions channel or view the current settings"
            },
            config: {
                args: 1,
                permissions: {
                    user: "MANAGE_GUILD",
                    bot: "MANAGE_WEBHOOKS"
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
        let embed;
        let channels;
        let m;
        switch (arg) {
            case "on":
                embed = {
                    description: `Please mention a channel below, or type its ID. You have 10 seconds`,
                    color: client.config.colours.main
                }
                m = await msg.reply({ embed });
                try {
                    channels = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {
                        max: 1,
                        time: 10000,
                        errors: ["time"]
                    });
                } catch {
                    return await m.edit("Timed out")
                }
                let chan = channels.first().mentions.channels.first() || msg.guild.channels.cache.get(channels.first().content);
                if (!chan || chan.type != "text") return await msg.reply(`${client.config.emojis.cross} Invalid Channel!`)
                const webhook = await chan.createWebhook(`${client.user.username} Suggestions`, {
                    avatar: client.user.avatarURL()
                });
                msg.guild.options.suggestions = {
                    id: webhook.id,
                    token: webhook.token
                }
                await client.db.Guilds.set(msg.guild.id, msg.guild.options);
                await msg.reply(`${client.config.emojis.tick} Suggestions channel set!`)
                break;
            case "off":
                msg.guild.options.suggestions = null;
                await client.db.Guilds.set(msg.guild.id, msg.guild.options);
                await msg.reply(`${client.config.emojis.tick} Suggestions turned off`)
                break;
            default:
                await msg.reply(client.UsageEmbed(this));
                break;
        }
    }
}