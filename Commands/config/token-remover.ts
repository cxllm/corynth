import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("token-remover", {
            description: "Turn the token-remover on or off.",
            aliases: [],
            usage: "[status]"
        }, {
            owner: false,
            args: 0,
            permissions: {
                user: "MANAGE_GUILD"
            }
        })
        this.client = client;
    }
    async run(msg: Message) {
        if (msg.args[0].toLowerCase() == "status") {
            const token = msg.db.token;
            return await msg.send({
                embed: {
                    title: "Token Remover Status",
                    description: `This server currently has token remover ${token ? "on" : "off"}. To change this please run \`${msg.db.prefix}${this.name}\``,
                    color: this.client.config.colours.main
                }
            })
        } else {
            msg.db.token = !msg.db.token;
            console.log(msg.db.token)
            await msg.send({
                embed: {
                    title: `Token Remover ${msg.db.token ? "On" : "Off"}`,
                    description: `${this.client.config.emojis.tick} The token remover has been turned ${msg.db.token ? "on" : "off"}`,
                    color: this.client.config.colours.success
                }
            });
            return await this.client.db.guilds.set(msg.guild.id, msg.db)
        }
    }
}