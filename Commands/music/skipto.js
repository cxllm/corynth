const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("skipto", {
            help: {
                aliases: [],
                usage: "",
                description: "Skip to a song"
            },
            config: {
                args: 0,
                permissions: {
                    user: false,
                    bot: false
                },
                owner: false,
                cooldown: "2.5s"
            }
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        let queue = client.queue.get(msg.guild.id)
        if (!queue || !queue.player) return await msg.reply(client.presets.nothing_playing);
        if (!msg.member.voice.channel || msg.member.voice.channel.id != queue.voice.id) return await msg.reply(client.presets.not_queue_vc);
        const songNumber = parseInt(msg.args[0]);
        if (isNaN(songNumber)) return await msg.reply("Invalid Number!");
        if (songNumber > queue.songs.length - 1 || songNumber < 1) return await msg.reply(`Please enter a number within the queue length`);
        queue.songs.splice(0, songNumber - 1)
        await msg.reply(`⏩ Skipped to song ${songNumber}`)
        queue.player.stopTrack();
    }
}