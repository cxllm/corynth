import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { exec } from "child_process"
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("pull", {
            description: "Pull from the git repo.",
            aliases: [],
            usage: "<command>"
        }, {
            owner: true,
            args: 1,
            permissions: {}
        })
        this.client = client;
    }
    async run(msg: Message) {
        exec("ggit fetch --all && git reset --hard origin/master", async (_, out, stderr) => {
            return await msg.send(`\`\`\`${(out || stderr).substr(0, 1994)}\`\`\``)
        });

    }
}