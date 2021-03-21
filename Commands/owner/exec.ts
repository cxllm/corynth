import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { exec } from "child_process"
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("exec", {
            description: "Execute a command.",
            aliases: ["execute", "sh", "shell"],
            usage: "<command>"
        }, {
            owner: true,
            args: 1,
            permissions: {}
        })
        this.client = client;
    }
    async run(msg: Message) {
        exec(msg.args.join(" "), async (_, out, stderr) => {
            return await msg.send(`\`\`\`${(out || stderr).substr(0, 1994)}\`\`\``)
        });

    }
}