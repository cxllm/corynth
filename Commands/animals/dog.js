const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("dog", {
            help: {
                aliases: [],
                usage: "",
                description: "View a dog image"
            },
            config: {
                args: false,
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
        await msg.reply(`${client.config.emojis.loading}`)
        let { data } = await client.axios.get(`https://api.alexflipnote.dev/dogs`, {
            headers: {
                'Authorization': client.config.afn
            }
        })
        await msg.reply("", {
            files: [{
                attachment: data.file,
                name: 'dog.gif'
            }]
        });

    }
}