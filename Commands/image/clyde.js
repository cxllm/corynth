const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("clyde", {
            help: {
                aliases: [],
                usage: "<text>",
                description: "Make an image of clyde saying something"
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
        let text = encodeURIComponent(msg.args.join(" "))
        if (text.length > 500) return msg.reply("Text has to be shorter than 500 characters!")
        await msg.reply(`${client.config.emojis.loading}`)
        try {
            let { data } = await client.axios.get(`https://nekobot.xyz/api/imagegen?type=clyde&text=${text}`)
            await msg.reply("", {
                files: [{
                    attachment: data.message,
                    name: 'clyde.png'
                }]
            });
        } catch {
            await msg.reply(client.presets.chars_inv)
        }

    }
}