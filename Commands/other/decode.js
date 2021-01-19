const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("decode", {
            help: {
                aliases: [],
                usage: "<base64/hex/binary> <text>",
                description: "Decode some encoded text"
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
            const decoded = client.Util.decode(type, text);
            let embed = {
                title: `Decoded Text into ${type.toProperCase()}`,
                description: decoded,
                color: client.config.colours.main
            }
            await msg.reply({ embed });
        } catch {
            return await msg.reply(`Invalid type or text`)
        }
    }
}