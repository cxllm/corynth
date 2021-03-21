"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
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
        });
        this.client = client;
    }
    async run(msg) {
        let queue = this.client.queue.get(msg.guild.id);
        if (!queue || !queue.player)
            return await msg.send(this.client.presets.nothing_playing);
        if (!msg.member.voice.channel || msg.member.voice.channel.id != queue.voice.id)
            return await msg.send(this.client.presets.not_queue_vc);
        let arg = msg.args.shift().toLowerCase();
        if (arg == "on") {
            queue.filters.timescale = { pitch: 1.25, speed: 1.05 };
        }
        else if (arg == "off") {
            queue.filters.timescale = null;
        }
        else
            return await msg.reply(this.client.UsageEmbed(this));
        await queue.player.setGroupedFilters(queue.filters);
        await msg.reply(this.client.presets.filters.replace("[filter]", "Nightcore").replace("[number]", arg));
    }
};
