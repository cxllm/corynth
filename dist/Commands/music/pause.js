"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("pause", {
            description: "Pause the current song.",
            aliases: [],
            usage: ""
        }, {
            owner: false,
            args: 0,
            permissions: {},
            cooldown: "2.5s"
        });
        this.client = client;
    }
    async run(msg) {
        let queue = this.client.queue.get(msg.guild.id);
        if (!queue || !queue.player)
            return await msg.send(this.client.presets.nothing_playing);
        if (!msg.member.voice.channel || msg.member.voice.channel.id != queue.voice.id)
            return await msg.send(this.client.presets.not_queue_vc);
        if (queue.player.paused)
            return await msg.send("The queue is already paused!");
        await queue.player.setPaused(true);
        await msg.send(`⏸ Queue paused`);
    }
};
