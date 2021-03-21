import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("icon", {
            description: "View the server icon",
            aliases: [],
            usage: ""
        }, {
            owner: false,
            args: 0,
            permissions: {}
        })
        this.client = client;
    }
    async run(msg: Message) {
        if (!msg.guild.icon) return await msg.send("This server does not have an icon!")
        const url = msg.guild.iconURL({ dynamic: true, size: 2048, format: "png" })
        const avatar = {
            png: msg.guild.iconURL({ format: "png" }),
            jpg: msg.guild.iconURL({ format: "jpg" }),
            webp: msg.guild.iconURL({ format: "webp" }),

        };
        const embed = {
            title: `${msg.guild.name}'s Icon`,
            description: Object.keys(avatar).map(i => `[${i}](${avatar[i]})`).join(" | "),
            image: {
                url
            },
            color: this.client.config.colours.main
        }
        return await msg.send({ embed })
    }
}