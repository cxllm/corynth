import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("prefix", {
            description: "Configure the prefix for your server.",
            aliases: [],
            usage: "<new prefix|clear>"
        }, {
            owner: false,
            args: 1,
            permissions: {
                user: "MANAGE_GUILD"
            }
        })
        this.client = client;
    }
    async run(msg: Message) {
        if (msg.args[0].toLowerCase() == "clear") {
            msg.db.prefix = this.client.config.prefix;
            await msg.send({
                embed: {
                    title: "Prefix Reset",
                    description: `${this.client.config.emojis.tick} Server prefix was reset to ${msg.db.prefix}`,
                    color: this.client.config.colours.success
                }
            });
        } else {
            msg.db.prefix = msg.args[0];
            await msg.send({
                embed: {
                    title: "Prefix Set",
                    description: `${this.client.config.emojis.tick} Server prefix was set to ${msg.db.prefix}`,
                    color: this.client.config.colours.success
                }
            });
        }
        return await this.client.db.guilds.set(msg.guild.id, msg.db)
    }
}