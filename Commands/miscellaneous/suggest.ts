import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { WebhookClient, Message as M } from "discord.js-light"
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("suggest", {
            description: "Suggest something if your server has suggestions enabled.",
            aliases: [],
            usage: "<suggestion>"
        }, {
            owner: false,
            args: 1,
            permissions: {
                bot: "ADD_REACTIONS"
            }
        })
        this.client = client;
    }
    async run(msg: Message) {
        const { suggestions } = msg.db;
        if (!suggestions || !suggestions.id || !suggestions.token) return await msg.reply(`Suggestions are disabled in this server`);
        let webhook;
        try {
            webhook = new WebhookClient(suggestions.id, suggestions.token);
            await webhook.send('', {
                embeds: [
                    {
                        title: `Suggestion from ${msg.author.tag}`,
                        description: msg.args.join(" "),
                        footer: {
                            text: `Provided by ${this.client.user.tag}`,
                            iconURL: this.client.user.avatarURL()
                        },
                        thumbnail: {
                            url: msg.author.avatarURL({ dynamic: true })
                        },
                        color: this.client.config.colours.main
                    }
                ],
                username: msg.author.tag,
                avatarURL: msg.author.avatarURL()
            });
        } catch (e) {
            console.log(e)
            msg.db.suggestions = null;
            await this.client.db.guilds.set(msg.guild.id, msg.db);
            return await msg.reply(`Suggestions are disabled in this server`);
        }
        await msg.send(`Suggestion sent`)
    }
}