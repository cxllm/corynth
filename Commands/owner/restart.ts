import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { exec } from "child_process"
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("restart", {
            description: "Restart the bot.",
            aliases: ["reboot"],
            usage: "<command>"
        }, {
            owner: true,
            args: 1,
            permissions: {}
        })
        this.client = client;
    }
    async run(msg: Message) {
        await msg.send("Restarted")
        process.exit()

    }
}