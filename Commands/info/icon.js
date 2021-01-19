const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("icon", {
            help: {
                aliases: ["servericon"],
                usage: "",
                description: "Get the server icon"
            },
            config: {
                args: false,
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
        await msg.reply(client.config.emojis.loading)
        const url = msg.guild.iconURL({ dynamic: true })
        let type = {
            png: msg.guild.iconURL({ format: 'png' }),
            gif: msg.guild.iconURL({ format: 'gif' }),
            jpg: msg.guild.iconURL({ format: 'jpg' })
        }
        let embed;
        if (url) embed = {
            title: `Server Icon - ${msg.guild.name}`,
            description: Object.keys(type).map(a => `[${a.toUpperCase()}](${type[a]})`).join(" | "),
            url,
            image: {
                url
            },
            color: client.config.colours.main
        }
        else embed = {
            title: `Server Icon - ${msg.guild.name}`,
            description: `This server does not have an icon`,
            color: client.config.colours.main
        }
        await msg.reply({ embed })
    }
}