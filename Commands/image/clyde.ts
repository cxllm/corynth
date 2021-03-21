import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("clyde", {
            description: "Make clyde say your own custom text.",
            aliases: [],
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
        let text = encodeURIComponent(msg.args.join(" "))
        if (text.length > 500) return await msg.send(this.client.presets.less_than_500)
        await msg.send(this.client.presets.edit_image)
        try {
            let { data } = await this.client.web.get(`https://nekobot.xyz/api/imagegen?type=clyde&text=${text}`)
            await msg.send("", {
                files: [{
                    attachment: data.message,
                    name: 'clyde.png'
                }]
            });
        } catch {
            await msg.send(this.client.presets.chars_inv)
        }

    }
}