const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message, Util: { resolveColor } } = require("discord.js-light");
const { monthsShort } = require("moment");
module.exports = class extends Command {
    constructor() {
        super("hex", {
            help: {
                aliases: [],
                usage: "<hex code>",
                description: "Find info about a hex code"
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
        let hex = msg.args[0].replace("#", "")
        try {
            let { data } = await client.axios.get(`https://api.alexflipnote.dev/colour/${hex}`, {
                headers: {
                    'Authorization': client.config.afn
                }
            });
            let embed = {
                title: `Hex Info - ${data.hex}`,
                description: `Colour Name: \`${data.name}\`\nRGB: \`${data.rgb}\``,
                color: resolveColor(data.hex),
                image: {
                    url: data.image
                }
            }
            await msg.reply({ embed })
        } catch {
            await msg.reply("Invalid hex code!")
        }
    }
}