import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("fox", {
            description: "See a picture of a fox.",
            aliases: [],
            usage: ""
        }, {
            owner: false,
            args: 0,
            permissions: {},
            cooldown: "5s"
        })
        this.client = client;
    }
    async run(msg: Message) {
        await msg.send(this.client.presets.loading_image)
        let { data } = await this.client.web.get(`https://some-random-api.ml/img/panda`)
        await msg.send({
            files: [{
                attachment: data.link,
                name: 'panda.gif'
            }]
        });
    }
}