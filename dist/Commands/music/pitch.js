"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("pitch", {
            description: "Change the pitch of the player.",
            aliases: [],
            usage: "<0-5>"
        }, {
            owner: false,
            args: 1,
            permissions: {},
            cooldown: "2.5s",
            filter: true
        });
        this.client = client;
    }
    async run(msg) {
        let queue = this.client.queue.get(msg.guild.id);
        if (!queue || !queue.player)
            return await msg.send(this.client.presets.nothing_playing);
        if (!msg.member.voice.channel || msg.member.voice.channel.id != queue.voice.id)
            return await msg.send(this.client.presets.not_queue_vc);
        let number = parseFloat(msg.args[0]);
        if (isNaN(number))
            return await msg.send(this.client.UsageEmbed(this));
        if (number > 5 || number < 0)
            return msg.send(`Please enter a valid number between 0 and 5`);
        if (number === 0)
            number = null;
        if (!queue.filters.timescale)
            queue.filters.timescale = { pitch: number };
        else
            queue.filters.timescale.pitch = number;
        await queue.player.setGroupedFilters(queue.filters);
        await msg.send(this.client.presets.filters.replace("[filter]", "Pitch").replace("[number]", number.toString()));
    }
};
