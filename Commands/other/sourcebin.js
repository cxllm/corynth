const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("sourcebin", {
            help: {
                aliases: ["paste", "upload", "bin"],
                usage: "<text>",
                description: "Upload to text to sourcebin"
            },
            config: {
                args: 1,
                permissions: {
                    user: false,
                    bot: false
                },
                owner: false,
                cooldown: "10s"
            }
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        const text = msg.args.join(" ");
        await msg.reply(await client.Util.genSourcebin(text, ``, `text`, `Using ${client.user.tag}`, `Uploaded by ${msg.author.tag}`))
    }
}