import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("encode", {
            description: "Encode text into your choice of different encoding methods.",
            aliases: [],
            usage: "<binary|hex|base64>"
        }, {
            owner: false,
            args: 1,
            permissions: {}
        })
        this.client = client;
    }
    async run(msg: Message) {
        let type = msg.args[0].toLowerCase(), text = msg.args.slice(1).join(" ")
        try {
            const encoded = this.client.Util.encode(type, text);
            let embed = {
                title: `Encoded Text into ${type.toProperCase()}`,
                description: encoded,
                color: this.client.config.colours.main
            }
            await msg.send({ embed });
        } catch {
            return await msg.send(this.client.UsageEmbed(this));

        }
    }
}