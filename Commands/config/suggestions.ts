import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("suggestions", {
            description: "Turn suggestions on or off.",
            aliases: [],
            usage: "<on|off>"
        }, {
            owner: false,
            args: 1,
            permissions: {
                user: "MANAGE_GUILD",
                bot: "MANAGE_WEBHOOKS"
            }
        })
        this.client = client;
    }
    async run(msg: Message) {
        let arg = msg.args[0].toLowerCase();
        let embed;
        let channels;
        let m;
        switch (arg) {
            case "on":
                embed = {
                    description: `Please mention a channel below, or type its ID. You have 10 seconds`,
                    color: this.client.config.colours.main
                }
                m = await msg.send({ embed });
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
                if (!chan || chan.type != "text") return await msg.send(`${this.client.config.emojis.cross} Invalid Channel!`)
                const webhook = await chan.createWebhook(`${this.client.user.username} Suggestions`, {
                    avatar: this.client.user.avatarURL()
                });
                msg.db.suggestions = {
                    id: webhook.id,
                    token: webhook.token
                }
                await this.client.db.guilds.set(msg.guild.id, msg.db);
                await msg.send(`${this.client.config.emojis.tick} Suggestions channel set!`)
                break;
            case "off":
                msg.db.suggestions = null;
                await this.client.db.guilds.set(msg.guild.id, msg.db);
                await msg.send(`${this.client.config.emojis.tick} Suggestions turned off`)
                break;
            default:
                await msg.send(this.client.UsageEmbed(this));
                break;
        }
    }
}