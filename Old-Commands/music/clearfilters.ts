import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("clearfilters", {
            description: "Clear all the filters in the player.",
            aliases: ["clear-filters"],
            usage: ""
        }, {
            owner: false,
            args: 0,
            permissions: {},
            cooldown: "2.5s"
        })
        this.client = client;
    }
    async run(msg: Message) {
        let queue = this.client.queue.get(msg.guild.id)
        if (!queue || !queue.player) return await msg.send(this.client.presets.nothing_playing);
        if (!msg.member.voice.channel || msg.member.voice.channel.id != queue.voice.id) return await msg.send(this.client.presets.not_queue_vc);
        queue.filters = {
            volume: queue.filters.volume
        };
        queue.player.setGroupedFilters(queue.filters);
        return await msg.send(`Filters Cleared!`)
    }
}