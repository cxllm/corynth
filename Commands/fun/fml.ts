import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("fml", {
            description: "See an \"FML\" story.",
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
        const { data } = await this.client.web.get("https://api.alexflipnote.dev/fml", {
            headers: {
                'Authorization': this.client.config.afn
            }
        });
        let embed = {
            title: `FML Story`,
            color: this.client.config.colours.main,
            description: `${data.text}`,
        }
        await msg.send({ embed })
    }
}