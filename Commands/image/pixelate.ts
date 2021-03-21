import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("pixelate", {
            description: "Turn a user's avatar, image or your own avatar pixelated.",
            aliases: ["pixelated"],
            usage: "[user]"
        }, {
            owner: false,
            args: 0,
            permissions: {},
            cooldown: "5s"
        })
        this.client = client;
    }
    async run(msg: Message) {
        await msg.send(this.client.presets.edit_image);
        const url = await this.client.Util.getMessageImage(msg);
        let data = await this.client.canva.pixelate(url);

        await msg.send("", {
            files: [
                {
                    attachment: data,
                    name: 'pixelated.png'
                }
            ]
        })
    }
}