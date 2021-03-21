import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("avatar", {
            description: "View your own or another user's avatar.",
            aliases: ["av", "pfp"],
            usage: "[user]"
        }, {
            owner: false,
            args: 0,
            permissions: {}
        })
        this.client = client;
    }
    async run(msg: Message) {
        const { user } = await this.client.Util.getMember(msg);
        const url = user.displayAvatarURL({ dynamic: true, size: 2048, format: "png" })
        const avatar = {
            png: user.displayAvatarURL({ format: "png" }),
            jpg: user.displayAvatarURL({ format: "jpg" }),
            webp: user.displayAvatarURL({ format: "webp" }),
        };
        const embed = {
            title: `${user.tag}'s Avatar`,
            description: Object.keys(avatar).map(i => `[${i}](${avatar[i]})`).join(" | "),
            image: {
                url
            },
            color: this.client.config.colours.main
        }
        return await msg.send({ embed })
    }
}