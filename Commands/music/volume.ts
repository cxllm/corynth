import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("volume", {
            description: "Change the volume of the player.",
            aliases: ["v", "vol"],
            usage: "<1-500>"
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
        let number = parseInt(msg.args[0]);
        if (isNaN(number)) return await msg.send(this.client.UsageEmbed(this));
        if (number > 500 || number < 1) return msg.send(`Please enter a valid number between 1 and 500`)
        else queue.filters.volume = number / 100;
        await queue.player.setVolume(number / 100);
        await msg.send(this.client.presets.filters.replace("[filter]", "Volume").replace("[number]", number.toString()))
    }
}