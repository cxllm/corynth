const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("search", {
            help: {
                aliases: [],
                usage: "<song name>",
                description: "Play a song from YouTube"
            },
            config: {
                args: 1,
                permissions: {
                    user: false,
                    bot: false
                },
                owner: false,
                cooldown: "10s"
            }
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        if (!msg.member.voice.channel) return await msg.reply(`${client.config.emojis.cross} You aren't connected to a voice channel!`)
        let queue = client.queue.get(msg.guild.id);
        if (queue) {
            if (msg.member.voice.channel.id != queue.voice.id) return await msg.reply(`${client.config.emojis.cross} Music is already playing in another channel!`);
        }
        let query = msg.args.join(" ");
        let loadmsg = await msg.reply(`${client.config.emojis.loading} Loading song...`);
        let results;
        try {
            results = await client.music.rest.resolve(query, `youtube`)
            if (!results) throw new Error("Not found")
        } catch (e) {
            console.log(e)
            return await msg.reply(`${client.config.emojis.cross} Song not found`)
        }
        if (!results || !results.tracks || results.tracks.length <= 0) return await msg.reply(`${client.config.emojis.cross} Song not found`);
        const songs = results.tracks.slice(0, 5);
        let i = 1;
        let embed = {
            title: "Song Selection",
            fields: songs.map(song => {
                return {
                    name: `Result ${i++} `,
                    value: `[${song.info.title}](${song.info.uri}) ${song.info.author ? `by ${song.info.author}` : ""} - ${client.Util.timestamp(song.info.length)}`
                }
            }),
            color: client.config.colours.main,
            footer: {
                text: `Please select a number between 1 and ${songs.length} or type cancel to cancel. You have 10s`
            }
        }
        await msg.reply({ embed })
        let response;
        try {
            response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content <= songs.length || msg2.content.toLowerCase() === "cancel", {
                max: 1,
                time: 10000,
                errors: ['time']
            });
        } catch (err) {
            console.error(err);
        }
        if (!response || response.size === 0) {
            return await msg.reply('Timed out due to invalid or no selection');
        }
        if (response.first().content.toLowerCase() === "cancel") {
            return await msg.reply('Cancelled');
        }
        const song = results.tracks[parseInt(response.first().content) - 1];
        if (song.info.isStream) return await msg.reply(`${client.config.emojis.cross} Livestreams can't be played at the moment`);
        client.commands.get("play").handle(client, msg, song, loadmsg);
    }
}