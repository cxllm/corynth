import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("shuffle", {
            description: "Shuffle the songs in the queue.",
            aliases: [],
            usage: ""
        }, {
            owner: false,
            args: 0,
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
        if (queue.songs.length <= 2) return await msg.send("You can't shuffle a queue with 2 songs or less!")
        const song = queue.songs.shift()
        const arr = queue.songs;
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        queue.songs = [song, ...arr]
        return await msg.send(`I shuffled the queue!`)
    }
}