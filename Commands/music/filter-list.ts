import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("filter-list", {
            description: "View the filters you can change.",
            aliases: [],
            usage: ""
        }, {
            owner: false,
            args: 0,
            permissions: {},
            cooldown: "1s",
            filter: false
        })
        this.client = client;
    }
    async run(msg: Message) {
        const filters = this.client.commands.filter(c => c.config.filter);
        let embed = {
            title: 'Filter Commands',
            description: filters.map(f => `**${f.name}** (${f.info.description}) - Usage: \`${msg.db.prefix}${f.name} ${f.info.usage}\``).join("\n"),
            color: this.client.config.colours.main
        }
        await msg.send({ embed })
    }
}