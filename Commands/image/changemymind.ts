import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("changemymind", {
            description: "Make a change my mind with your own custom text.",
            aliases: ["cmm"],
            usage: "<text>"
        }, {
            owner: false,
            args: 1,
            permissions: {},
            cooldown: "5s"
        })
        this.client = client;
    }
    async run(msg: Message) {
        let text = msg.args.join(" ")
        if (text.length > 500) return await msg.send(this.client.presets.less_than_500);
        await msg.send(this.client.presets.edit_image)
        let data = await this.client.canva.changemymind(text);
        await msg.send("", {
            files: [{
                attachment: data,
                name: 'changemymind.png'
            }]
        });

    }
}