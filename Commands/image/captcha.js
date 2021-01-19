const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("captcha", {
            help: {
                aliases: [],
                usage: "<text>",
                description: "Make a captcha with your text"
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
        if (text.length > 500) return await msg.reply(client.presets.less_than_500)
        let { data } = await client.axios.get(`https://api.alexflipnote.dev/captcha?text=${text}`, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': client.config.afn
            }
        });
        await msg.reply({
            files: [{
                attachment: data,
                name: 'captcha.png'
            }]
        });

    }
}