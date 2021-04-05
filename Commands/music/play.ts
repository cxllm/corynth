import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import ytpl from "ytpl";
import { ShoukakuPlayer } from "shoukaku";
import Track from "../../Structs/Track";
import { DMChannel, Guild, NewsChannel, TextChannel, VoiceChannel } from "discord.js";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("play", {
            description: "Play music to a voice channel.",
            aliases: ["p"],
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
        let playlistid: string;
        let loadmsg = await msg.send(`${this.client.config.emojis.loading} Loading song...`);
        if (query.includes("list=")) {
            playlistid = query.split("list=")[1]

        }
        let results;
        try {
            if (playlistid) {
                const playlist = await ytpl(playlistid);
                results = {
                    playlistName: playlist.title,
                    tracks: playlist.items.map(item => {
                        return {
                            track: null,
                            info: {
                                identifier: item.id,
                                title: item.title,
                                uri: item.shortUrl,
                                length: item.durationSec * 1000,
                                duration: this.client.Util.timestamp(item.durationSec * 1000),
                                author: item.author.name,
                                isStream: item.isLive,
                                isSeekable: !item.isLive
                            }
                        }
                    })
                }
            }
            else results = await this.client.music.rest.resolve(query, `youtube`)
            if (!results) throw new Error("Not found")
        } catch (e) {
            console.log(e)
            return await msg.send(`${this.client.config.emojis.cross} Not found`)
        }
        let song = results.tracks[0];
        if (!song) return await msg.send(`${this.client.config.emojis.cross} Not found`);
        if (song.live) return await msg.send(`${this.client.config.emojis.cross} Livestreams can't be played due to issues with playing them.`);
        this.handle(this.client, msg, song, loadmsg, results.playlistName ? results : undefined);
    }
    async handle(client: Client, msg: Message, song: Track, loadmsg: Message, playlist: { playlistName?: string, tracks: Track[] }) {
        let queue = client.queue.get(msg.guild.id);
        if (!queue) {
            let queueStruct = {
                text: msg.channel,
                voice: msg.member.voice.channel,
                player: null,
                songs: [],
                loop: 0,
                npmsg: null,
                thumbnail: msg.guild.iconURL(),
                filters: {
                    volume: 0.25,
                    bassboost: null
                }
            };
            client.queue.set(msg.guild.id, queueStruct);
            queue = client.queue.get(msg.guild.id);
        }
        if (song.info.length > 24 * 60 * 60 * 1000) {
            return await msg.reply("The song can't be longer than 1 day!")
        }
        //@ts-ignore
        song.info.duration = this.client.Util.timestamp(song.info.length);
        const before = queue.songs.length;
        if (playlist) {
            queue.songs.push(...playlist.tracks);

        } else queue.songs.push(song);
        if (before > 0) {
            let embed;
            if (playlist) embed = {
                title: "Playlist added to Queue",
                fields: [
                    {
                        name: "Playlist Name",
                        value: playlist.playlistName
                    },
                    {
                        name: "Total Songs",
                        value: playlist.tracks.length
                    }
                ],
                color: client.config.colours.main
            }

            else embed = {
                title: "Song added to Queue",
                fields: [
                    {
                        name: "Title", value: `[${song.info.title}](${song.info.uri})`
                    },
                    {
                        name: "Author", value: song.info.author,
                    },
                    {
                        name: "Duration", value: song.info.duration
                    },
                ],
                thumbnail: {
                    url: queue.thumbnail
                },
                color: client.config.colours.main
            }
            return await loadmsg.edit("", { embed })
        }
        else try {
            if (playlist) {
                await queue.text.send({
                    embed: {
                        title: "Playlist added to Queue",
                        fields: [
                            {
                                name: "Playlist Name",
                                value: playlist.playlistName
                            },
                            {
                                name: "Total Songs",
                                value: playlist.tracks.length
                            }
                        ],
                        color: client.config.colours.main
                    }
                })
            }
            //@ts-ignore
            await this.play(client, msg.guild, queue);
            loadmsg.delete()
        } catch (e) {
            console.log(e)
            client.queue.delete(msg.guild.id)
            return await msg.reply(`${client.config.emojis.cross} An error occured and I couldn't join the voice channel.`)
        }
    }
    async play(client: Client, guild: Guild, queue: {
        text: TextChannel | DMChannel | NewsChannel,
        voice: VoiceChannel,
        player: ShoukakuPlayer,
        songs: Track[],
        loop: number,
        npmsg: Message,
        thumbnail: string,
        filters: {
            volume: number,
            bassboost: number
        },
        timedout?: boolean
    }) {
        let song = queue.songs[0];
        if (!song) {
            queue.player.disconnect();
            if (queue.timedout) return;
            queue.text.send("The queue has ended so I left the voice channel");
            return client.queue.delete(guild.id);
        }
        queue.player = await client.music.joinVoiceChannel({
            guildID: guild.id,
            voiceChannelID: queue.voice.id,
            deaf: true
        });
        queue.player.once('end', () => {
            queue.npmsg.delete();
            switch (queue.loop) {
                case 0:
                    queue.songs.shift();
                    break;
                case 1:
                    if (queue.songs[0].skipped) queue.songs.shift()
                    break;
                case 2:
                    let song = queue.songs.shift();
                    if (!song.skipped) queue.songs.push(song)
                    break;
            }
            this.play(client, guild, queue);
        });
        if (!song.track) {
            let info = (await client.music.rest.resolve(song.info.uri, `youtube`));
            if (info?.tracks) song.track = info.tracks[0].track
            else {
                let info2 = (await client.music.rest.resolve(`${song.info.title} ${song.info.author}`, `youtube`));
                if (info2?.tracks) song.track = info2.tracks[0].track

            }
        }

        if (!song.track) queue.player.stopTrack();
        else {
            await queue.player.playTrack(song.track)
            await queue.player.setGroupedFilters(queue.filters)
            let embed = {
                title: "Now Playing",
                fields: [
                    {
                        name: "Title", value: `[${song.info.title}](${song.info.uri})`
                    },
                    {
                        name: "Author", value: song.info.author,
                    },
                    {
                        name: "Duration", value: song.info.duration
                    },

                ],
                thumbnail: {
                    url: queue.thumbnail
                },
                color: client.config.colours.main
            }
            //@ts-ignore
            queue.npmsg = await queue.text.send({ embed });
        }
    }
}