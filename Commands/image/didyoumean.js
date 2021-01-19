const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("didyoumean", {
            help: {
                aliases: [],
                usage: "<text> | <text>",
                description: "Make your own google did you mean image"
            },
            config: {
                args: 3,
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
        let arr = msg.args.join(' ').split('|')
        if(!arr || arr.length != 2) return await msg.reply(client.UsageEmbed(this));
        let text = [arr[0], arr[1]]
        if (!arr || !text) return msg.reply(client.presets.no_text)
        for (let str in text) {
            if (!text[str]) return await msg.reply(client.UsageEmbed(this));
            if (text[str].length > 500) return msg.reply(client.presets.less_than_500)
            else text[str] = encodeURIComponent(text[str])

        }
        try {
            let { data } = await client.axios.get(`https://api.alexflipnote.dev/didyoumean?top=${text[0]}&bottom=${text[1]}`, {
                responseType: 'arraybuffer',
                headers: {
                    'Authorization': client.config.afn
                }
            });
            await msg.reply({
                files: [{
                    attachment: data,
                    name: 'didyoumean.png'
                }]
            });
        } catch {
            await msg.reply(client.presets.chars_inv)
        }

    }
}