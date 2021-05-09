const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("trump", {
            help: {
                aliases: [],
                usage: "",
                description: "Disabled due to Trump's account being disabled"
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
        return await msg.reply("This command has been disabled due to Trump's twitter account being shut down.")
        /*let text = encodeURIComponent(msg.args.join(" "))
        if (text.length > 140) return msg.reply("Text has to be shorter than 140 characters!")
        await msg.reply(`${client.config.emojis.loading}`)
        try {
            let { data } = await client.axios.get(`https://nekobot.xyz/api/imagegen?type=trumptweet&text=${text}`)
            await msg.reply("", {
                files: [{
                    attachment: data.message,
                    name: 'clyde.png'
                }]
            });
        } catch {
            await msg.reply(client.presets.chars_inv)
        }
        */
    }
}