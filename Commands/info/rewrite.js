const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("rewrite", {
            help: {
                aliases: [],
                usage: "",
                description: "Find out rewrite info"
            },
            config: {
                args: 0,
                permissions: {
                    user: false,
                    bot: false
                },
                owner: false,
                cooldown: false
            }
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        let embed = {
            title: "Corynth's Rewrite",
            description: `Corynth's code has recently been rewritten which has brought a lot of changes
            The database has been wiped therefore you must reconfigure your settings (Sorry for any inconvenience)
            There are new commands and some old ones which weren't used have been removed
            Vote locked commands and premium have been removed sadly as they are hard to maintain
            Finally, music has returned with lower chance of rate limits
            I hope you enjoy the rewrite,
            Cxllm,
            Corynth Developer`,
            color: client.config.colours.main,
            thumbnail: {
                url: client.user.avatarURL()
            }
        }
        await msg.reply({ embed })
    }
}