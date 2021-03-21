import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { Util } from "discord.js-light";
const { resolveColor } = Util
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("hex", {
            description: "Find out info about a hex code.",
            aliases: [],
            usage: "<hex code>"
        }, {
            owner: false,
            args: 1,
            permissions: {},
            cooldown: "5s"
        })
        this.client = client;
    }
    async run(msg: Message) {
        let hex = msg.args[0].replace("#", "")
        try {
            let { data } = await this.client.web.get(`https://api.alexflipnote.dev/colour/${hex}`, {
                headers: {
                    'Authorization': this.client.config.afn
                }
            });
            let embed = {
                title: `Hex Info - ${data.hex}`,
                description: `Colour Name: \`${data.name}\`\nRGB: \`${data.rgb}\``,
                color: resolveColor(data.hex),
                image: {
                    url: data.image
                }
            }
            await msg.send({ embed })
        } catch {
            await msg.send("Invalid hex code!")
        }
    }
}