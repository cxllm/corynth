const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("changemymind", {
            help: {
                aliases: ["cmm"],
                usage: "<text>",
                description: "Make a change my mind meme"
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
        let text = msg.args.join(" ")
        if (text.length > 500) return await msg.reply(client.presets.less_than_500)
        await msg.reply(`${client.config.emojis.loading}`)
        let data = await client.canva.changemymind(text);
        await msg.reply("", {
            files: [{
                attachment: data,
                name: 'changemymind.png'
            }]
        });

    }
}