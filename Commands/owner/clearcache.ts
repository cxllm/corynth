import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("clearcache", {
            description: "Clear the bot's cache.",
            aliases: ["cc"],
            usage: ""
        }, {
            owner: true,
            args: 0,
            permissions: {}
        })
        this.client = client;
    }
    async run(msg: Message) {
        await msg.send("Currently clearing cache. Please wait...");
        this.client.users.cache.clear();
        this.client.db.guilds.clearCache();
        await msg.send("Cache cleared");
    }

}