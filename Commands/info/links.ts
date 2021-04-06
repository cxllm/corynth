import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("links", {
            description: "View the bot's important links.",
            aliases: ["support", "invite", "donate", "website"],
            usage: ""
        }, {
            owner: false,
            args: 0,
            permissions: {}
        })
        this.client = client;
    }
    async run(msg: Message) {
        await msg.send({
            embed: {
                title: "Important Links",
                description: Object.keys(this.client.links).map(link => `[${link.toProperCase()}](${this.client.links[link]})`).join(" | "),
                color: this.client.config.colours.main
            }
        });
    }
}