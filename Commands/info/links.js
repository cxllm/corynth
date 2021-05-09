const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("links", {
            help: {
                aliases: ["invite", "website", "support", "donate"],
                usage: "",
                description: "Find the links to invite, support, get help with the bot and its website!"
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
            title: `Invite ${client.user.username}`,
            description: Object.keys(client.links).map(link => {
                return `[${link.toProperCase()}](${client.links[link]})`
            }).join(" | "),
            color: client.config.colours.main,
            thumbnail: {
                url: client.user.avatarURL()
            }
        }
        await msg.reply({ embed })
    }
}