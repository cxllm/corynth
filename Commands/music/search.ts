import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { ShoukakuTrack } from "shoukaku";
import { Collection, Message as M } from "discord.js-light";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("search", {
            description: "Search for a song to play to a voice channel.",
            aliases: [],
            usage: "<song>"
        }, {
            owner: false,
            args: 1,
            permissions: {
                bot: "SPEAK"
            },
            cooldown: "5s"
        })
        this.client = client;
    }
    async run(msg: Message) {
        if (!msg.member.voice.channel) return await msg.send(`${this.client.config.emojis.cross} You aren't connected to a voice channel!`)
        let queue = this.client.queue.get(msg.guild.id);
        if (queue) {
            if (msg.member.voice.channel.id != queue.voice.id) return await msg.send(`${this.client.config.emojis.cross} Music is already playing in another channel!`);
        }
        let query = msg.args.join(" ");
        let loadmsg = await msg.send(`${this.client.config.emojis.loading} Loading song...`);

        let results;
        try {
            results = await this.client.music.rest.resolve(query, `youtube`)
            if (!results) throw new Error("Not found")
        } catch (e) {
            console.log(e)
            return await msg.send(this.client.presets.not_found);
        }
        if (!results || !results.tracks || results.tracks.length <= 0) return await msg.send(this.client.presets.not_found);
        const songs = results.tracks.slice(0, 5);
        let i = 1;
        let embed = {
            title: "Song Selection",
            fields: songs.map((song: ShoukakuTrack) => {
                return {
                    name: `Result ${i++} `,
                    value: `[${song.info.title}](${song.info.uri}) ${song.info.author ? `by ${song.info.author}` : ""} - ${this.client.Util.timestamp(song.info.length)}`
                }
            }),
            color: this.client.config.colours.main,
            footer: {
                text: `Please select a number between 1 and ${songs.length} or type cancel to cancel. You have 10s`
            }
        }
        await msg.send({ embed });
        let response: Collection<string, M>;
        try {
            response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content <= songs.length || msg2.content.toLowerCase() === "cancel", {
                max: 1,
                time: 10000,
                errors: ['time']
            });
        } catch { }
        if (!response || response.size === 0) {
            return await msg.send('Timed out due to invalid or no selection');
        }
        if (response.first().content.toLowerCase() === "cancel") {
            return await msg.send('Cancelled');
        }
        const song = results.tracks[parseInt(response.first().content) - 1];
        if (song.info.isStream) return await msg.send(`${this.client.config.emojis.cross} Livestreams can't be played at the moment`);
        //@ts-ignore
        this.client.commands.get("play").handle(this.client, msg, song, loadmsg);
    }
}