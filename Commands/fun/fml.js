const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("fml", {
            help: {
                aliases: [],
                usage: "",
                description: "Get an fml story"
            },
            config: {
                args: 0,
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
        const { data } = await client.axios.get("https://api.alexflipnote.dev/fml", {
            headers: {
                'Authorization': client.config.afn
            }
        });
        let embed = {
            title: `FML Story`,
            color: client.config.colours.main,
            description: `${data.text}`,
        }
        await msg.reply({ embed })

    }
}