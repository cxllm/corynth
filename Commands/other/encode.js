const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("encode", {
            help: {
                aliases: [],
                usage: "<base64/hex/binary> <text>",
                description: "Encode some text"
            },
            config: {
                args: 2,
                permissions: {
                    user: false,
                    bot: false
                },
                owner: false,
                cooldown: "2s"
            }
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        let type = msg.args[0].toLowerCase(), text = msg.args.slice(1).join(" ")
        try {
            const encoded = client.Util.encode(type, text);
            let embed = {
                title: `Encoded Text into ${type.toProperCase()}`,
                description: encoded,
                color: client.config.colours.main
            }
            await msg.reply({ embed });
        } catch {
            return await msg.reply(`Invalid Type`)

        }
    }
}