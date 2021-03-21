import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("bassboost", {
            description: "Change the bassboost of the player.",
            aliases: ["bb", "bass"],
            usage: "<1-10>"
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
        const bassboost = parseFloat(msg.args[0]);
        if (isNaN(bassboost)) return await msg.send("Invalid Bassboost Value!");
        if (bassboost > 10 || bassboost < 0) return await msg.send("Please enter a number between 0 and 10");
        queue.player.setEqualizer(this.client.Util.eq(bassboost / 10));
        queue.filters.equalizer = this.client.Util.eq(bassboost / 10);
        await msg.send(this.client.presets.filters.replace("[filter]", "Bassboost").replace("[number]", bassboost.toString()))
    }
}