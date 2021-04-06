import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("coinflip", {
            description: "Perform a coin flip.",
            aliases: ["coin"],
            usage: ""
        }, {
            owner: false,
            args: 0,
            permissions: {}
        })
        this.client = client;
    }
    async run(msg: Message) {
        const coin = !!Math.round(Math.random()) ? "Heads" : "Tails";
        return await msg.send(`🪙 Coin Flipped! Outcome: \`${coin}\``);
    }
}