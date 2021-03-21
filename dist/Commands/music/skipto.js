"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("skipto", {
            description: "Skip to a song from the queue.",
            aliases: [],
            usage: "<song number>"
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
        const songNumber = parseInt(msg.args[0]);
        if (isNaN(songNumber))
            return await msg.send("Invalid Number!");
        if (songNumber > queue.songs.length - 1 || songNumber < 1)
            return await msg.send(`Please enter a number within the queue length`);
        queue.songs.splice(0, songNumber - 1);
        await msg.reply(`⏭️ Skipped to ${songNumber}`);
        queue.player.stopTrack();
    }
};
