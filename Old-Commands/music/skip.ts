import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("skip", {
            description: "Skip the current song.",
            aliases: [],
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
        queue.songs[0].skipped = true;
        await queue.player.stopTrack()
        await msg.send(`⏭ Song Skipped`)
    }
}