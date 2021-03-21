import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("unlock", {
            description: "Unlock a channel in your server.",
            aliases: [],
            usage: "<channel> [reason]"
        }, {
            owner: false,
            args: 1,
            permissions: {
                bot: "MANAGE_CHANNELS",
                user: "MANAGE_CHANNELS"
            }
        })
        this.client = client;
    }
    async run(msg: Message) {
        let channel = msg.mentions.channels.first() || msg.guild.channels.cache.get(msg.args[0]);
        if (!channel) return await msg.send(this.client.presets.invalid_channel)
        let reason = msg.args.slice(1).join(" ") || this.client.presets.no_reason
        await channel.updateOverwrite(msg.guild.id, {
            SEND_MESSAGES: true,
            ADD_REACTIONS: true
        })
        try {
            //@ts-expect-error
            channel.send({
                embed: {
                    title: "Channel Unlocked",
                    description: `This channel has been unlocked by ${msg.author.tag}\nReason: ${reason}`,
                    color: this.client.config.colours.success
                }
            });
        } catch {
            return await msg.send("Invalid channel")
        }
    }
}