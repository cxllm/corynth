import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("remove", {
            description: "Remove a song from the queue.",
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
        const songNumber = parseInt(msg.args[0]);
        if (isNaN(songNumber)) return await msg.send("Invalid Number!");
        if (songNumber > queue.songs.length - 1 || songNumber < 1) return await msg.send(`Please enter a number within the queue length`);
        delete queue.songs[songNumber];
        await msg.reply(`🗑️ Removed song ${songNumber}`)
    }
}