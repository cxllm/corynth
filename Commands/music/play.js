const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message, Guild } = require("discord.js-light");
const { ShoukakuTrack } = require("shoukaku");
const ytpl = require("ytpl");
module.exports = class extends Command {
    constructor() {
        super("play", {
            help: {
                aliases: ["p"],
                usage: "<song/youtube url>",
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
        if (query.includes("list=")) {
            query = {
                id: query.split("list=")[1]
            }
        }
        let results;
        try {
            if (query.id) {
                const playlist = await ytpl(query.id);
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
                                duration: client.Util.timestamp(item.durationSec * 1000),
                                author: item.author.name,
                                isStream: item.isLive,
                                isSeekable: !item.isLive
                            }
                        }
                    })
                }
            }
            else results = await client.music.rest.resolve(query, `youtube`)
            if (!results) throw new Error("Not found")
        } catch (e) {
            console.log(e)
            return await msg.reply(`${client.config.emojis.cross} Not found`)
        }
        let song = results.tracks[0];
        if (!song) return await msg.reply(`${client.config.emojis.cross} Not found`);
        if (song.live) return await msg.reply(`${client.config.emojis.cross} Livestreams can't be played due to issues with playing them.`);
        this.handle(client, msg, song, loadmsg, results.playlistName ? results : undefined);
    }
    /**
     *
     * @param {Client} client
     * @param {Message} msg
     * @param {ShoukakuTrack} song 
     */
    async handle(client, msg, song, loadmsg, playlist) {
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
                    volume: 0.5,
                    bassboost: null
                }
            };
            client.queue.set(msg.guild.id, queueStruct);
            queue = client.queue.get(msg.guild.id);
        }
        if (song.info.length > 24 * 60 * 60 * 1000) {
            return await msg.reply("The song can't be longer than 1 day!")
        }
        song.info.duration = client.Util.timestamp(song.info.length);
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
            await this.play(client, msg.guild, queue, song);
            loadmsg.delete()
        } catch (e) {
            console.log(e)
            client.queue.delete(msg.guild.id)
            return await msg.reply(`${client.config.emojis.cross} An error occured and I couldn't join the voice channel.`)
        }
    }
    /**
     * 
     * @param {Client} client 
     * @param {Guild} guild 
     * @param {*} queue 
     * @param {ShoukakuTrack} song 
     */
    async play(client, guild, queue, song) {
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
                    break;
                case 2:
                    let song = queue.songs.shift();
                    queue.songs.push(song)
                    break;
            }
            this.play(client, guild, queue, queue.songs[0]);
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
            queue.npmsg = await queue.text.send({ embed });
        }

    }
}