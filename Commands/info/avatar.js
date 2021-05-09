const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("avatar", {
            help: {
                aliases: ["av", "pfp"],
                usage: "[user]",
                description: "Get a user's (or your own) avatar"
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
        const member = await client.Util.getMember(msg)
        const url = member.user.displayAvatarURL({ dynamic: true, size: 2048 })
        let type = {
            png: member.user.displayAvatarURL({ format: 'png', size: 2048 }),
            gif: member.user.displayAvatarURL({ format: 'gif', size: 2048 }),
            jpg: member.user.displayAvatarURL({ format: 'jpg', size: 2048 })
        }
        const embed = {
            title: `Avatar - ${member.user.tag}`,
            description: Object.keys(type).map(a => `[${a.toUpperCase()}](${type[a]})`).join(" | "),
            url,
            image: {
                url
            },
            color: client.config.colours.main
        }
        await msg.reply({ embed })
    }
}