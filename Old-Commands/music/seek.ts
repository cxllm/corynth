import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import ms from "ms";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("seek", {
            description: "Seek to a specific song in the queue.",
            aliases: [],
            usage: "<song number>"
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
        if (queue.player.paused) return await msg.send("The queue is currently paused!")
        let milleseconds = null;
        for (const arg of msg.args) {
            if (!milleseconds) milleseconds = ms(arg)
            else milleseconds += ms(arg)
        }
        if (!milleseconds && milleseconds !== 0) return await msg.send("Please provide your time in a format like this: `1m 30s`");
        if (milleseconds > queue.songs[0].info.length || 0 > milleseconds) return await msg.send("Please provide a valid time within the song.");
        queue.player.seekTo(milleseconds);
        await msg.send(`⏩ Seeked to ${this.client.Util.timestamp(milleseconds)}`);
    }
}