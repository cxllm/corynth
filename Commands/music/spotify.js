const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("spotify", {
            help: {
                aliases: [],
                usage: "<lyrics/info> [user]",
                description: "Find out info/lyrics of someone's spotify song"
            },
            config: {
                args: 1,
                permissions: {
                    user: false,
                    bot: false
                },
                owner: false,
                cooldown: "5s"
            }
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        await msg.reply(client.config.emojis.loading);
        let opt = msg.args.shift().toLowerCase();
        let member = await client.Util.getMember(msg);
        const song = client.Util.getSpotifyInfo(member);
        if (!song) return await msg.reply(client.presets.no_spotify);
        let embed;
        switch (opt) {
            case "info":
                embed = {
                    title: `Spotify Info: ${member.user.tag}`,
                    thumbnail: {
                        url: song.image
                    },
                    description: `${member.user.tag} is listening to [${song.title} by ${song.artist}](${song.url})`,
                    fields: [
                        {
                            name: "Song Info", value: [
                                `Name: \`${song.title}\``,
                                `${song.artistNumber === 1 ? "Artist" : "Artists"}: \`${song.artist}\``,
                                `Duration: \`${song.duration}\``,
                                `URL: [Click Here](${song.url})`
                            ]
                        },
                        {
                            name: `${member.user.tag}'s Timestamps`, value: [
                                `Currently at: \`${song.current}\``,
                                `${song.title} started at: \`${song.start}\``,
                                `${song.title} will finish at: \`${song.end}\``
                            ]
                        }
                    ],
                    color: client.config.colours.main
                }
                return await msg.reply({ embed })
            case "lyrics":
                const s = (await client.Util.getLyrics(`${song.title} ${song.artist}`))[0].result
                if (!s) return await msg.reply("Sorry, Genius couldn't find that song.");
                embed = {
                    title: `Spotify Lyrics: ${song.title} by ${song.artist}`,
                    description: `[Lyrics to ${song.title}](${s.url})`,
                    url: s.url,
                    color: client.config.colours.main,
                    thumbnail: {
                        url: song.image
                    },
                    footer: {
                        text: 'Powered by Genius Lyrics API'
                    }
                }
                return await msg.reply({ embed })
            default:
                return await msg.reply(client.UsageEmbed(this));
        }
    }
}