import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("nightcore", {
            description: "Change the nightcore filter of the player.",
            aliases: [],
            usage: "<on/off>"
        }, {
            owner: false,
            args: 1,
            permissions: {},
            cooldown: "2.5s",
            filter: true
        })
        this.client = client;
    }
    async run(msg: Message) {
        let queue = this.client.queue.get(msg.guild.id)
        if (!queue || !queue.player) return await msg.send(this.client.presets.nothing_playing);
        if (!msg.member.voice.channel || msg.member.voice.channel.id != queue.voice.id) return await msg.send(this.client.presets.not_queue_vc);
        let arg = msg.args.shift().toLowerCase();
        if (arg == "on") {
            queue.filters.timescale = { pitch: 1.25, speed: 1.05 };
        } else if (arg == "off") {
            queue.filters.timescale = null;

        } else return await msg.reply(this.client.UsageEmbed(this));
        await queue.player.setGroupedFilters(queue.filters);
        await msg.reply(this.client.presets.filters.replace("[filter]", "Nightcore").replace("[number]", arg))
    }
}