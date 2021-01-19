const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("lyrics", {
            help: {
                aliases: [],
                usage: "<song>",
                description: "Find out lyrics of a song"
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

        let songs = await client.Util.getLyrics(msg.args.join(" "));
        songs = songs.slice(0, 5);
        let i = 1;
        let embed = {
            title: "Song Selection",
            fields: songs.map(song => {
                song = song.result;
                return {
                    name: `Result ${i++} `,
                    value: `[${song.full_title}](${song.url})`
                }
            }),
            color: client.config.colours.main,
            footer: {
                text: `Please select a number between 1 and ${songs.length} or type cancel to cancel.You have 10s`
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
            return await msg.reply('Cancelled')
        }
        const song = songs[parseInt(response.first().content) - 1].result;
        embed = {
            title: `Lyrics: ${song.full_title} `,
            description: `[Lyrics to ${song.title}](${song.url})`,
            url: song.url,
            color: client.config.colours.main,
            thumbnail: {
                url: song.song_art_image_thumbnail_url
            },
            footer: {
                text: 'Powered by Genius Lyrics API'
            }
        }
        return await msg.reply({ embed })

    }

}