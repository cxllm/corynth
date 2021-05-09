const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message, WebhookClient } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("suggest", {
            help: {
                aliases: [],
                usage: "<suggestion>",
                description: "Unlock a channel"
            },
            config: {
                args: 1,
                permissions: {
                    user: false,
                    bot: false
                },
                owner: false,
                cooldown: "10s"
            }
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        const { suggestions } = msg.guild.options;
        if (!suggestions || !suggestions.id || !suggestions.token) return await msg.reply(`Suggestions are disabled in this server`);
        let webhook;
        try {
            webhook = new WebhookClient(suggestions.id, suggestions.token);
            const m = await webhook.send('', {
                embeds: [
                    {
                        title: `Suggestion from ${msg.author.tag}`,
                        description: msg.args.join(" "),
                        footer: {
                            text: `Provided by ${client.user.tag}`,
                            iconURL: client.user.avatarURL()
                        },
                        thumbnail: {
                            url: msg.author.avatarURL({ dynamic: true })
                        },
                        color: client.config.colours.main
                    }
                ],
                username: msg.author.tag,
                avatarURL: msg.author.avatarURL()
            });
        } catch {
            msg.guild.options.suggestions = null;
            await client.db.Guilds.set(msg.guild.id, msg.guild.options);
            return await msg.reply(`Suggestions are disabled in this server`);
        }
        await msg.reply(`Suggestion sent`)
    }
}