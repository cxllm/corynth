const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("owoify", {
            help: {
                aliases: ["owo"],
                usage: "",
                description: "OwOify some text"
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
        const text = encodeURIComponent(msg.cleanArgs.join(" "))
        const { data } = await client.axios.get(`https://nekos.life/api/v2/owoify?text=${text}`);
        let embed = {
            description: data.owo,
            color: client.config.colours.main
        }
        await msg.reply({ embed })

    }
}