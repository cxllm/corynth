import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("purge", {
            description: "Purge up to 100 messages in a channel.",
            aliases: [],
            usage: "<1 - 100>"
        }, {
            owner: false,
            args: 1,
            permissions: {
                bot: "MANAGE_MESSAGES",
                user: "MANAGE_MESSAGES"
            }
        })
        this.client = client;
    }
    async run(msg: Message) {
        let count = parseInt(msg.args[0]);
        if (isNaN(count) || 0 >= count || 100 < count) return await msg.send("Please enter a valid number between 1 and 100");
        await msg.delete()
        //@ts-ignore
        let purged = (await msg.channel.bulkDelete(count, true)).size
        let embed = {
            title: `Messages Purged`,
            description: `A total of ${purged} messages were purged.`,
            footer: {
                text: `If this is not equal to the amount requested, this may be because of messages being older than 2 weeks or there not being this many messages`
            },
            color: this.client.config.colours.success
        }
        const m = await msg.send({ embed });
        setTimeout(() => {
            m.delete()
        }, 3000)
    }
}