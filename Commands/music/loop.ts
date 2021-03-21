import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("loop", {
            description: "Loop the queue or song.",
            aliases: [],
            usage: "<queue/q/song/s/off/o>"
        }, {
            owner: false,
            args: 1,
            permissions: {},
            cooldown: "2.5s"
        })
        this.client = client;
    }
    async run(msg: Message) {
        let queue = this.client.queue.get(msg.guild.id)
        if (!queue || !queue.player) return await msg.send(this.client.presets.nothing_playing);
        if (!msg.member.voice.channel || msg.member.voice.channel.id != queue.voice.id) return await msg.send(this.client.presets.not_queue_vc);
        const opt = msg.args[0].toLowerCase();
        let set = "";
        switch (opt) {
            case "q":
            case "queue":
                queue.loop = 2;
                set = "queue"
                break;
            case "s":
            case "song":
                queue.loop = 1;
                set = "song"
                break;
            case "o":
            case "off":
                queue.loop = 0;
                set = "off"
                break;
            default:
                return await msg.send(this.client.UsageEmbed(this));

        }
        await msg.send(`🔁 Loop set to ${set}`)
    }
}