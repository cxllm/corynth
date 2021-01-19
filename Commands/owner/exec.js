const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
const ms = require("ms");
module.exports = class extends Command {
    constructor() {
        super("exec", {
            help: {
                aliases: [],
                usage: "",
                description: "Execute a shell command"
            },
            config: {
                args: 1,
                permissions: {
                    user: false,
                    bot: false
                },
                owner: true
            }
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        require("child_process").exec(msg.args.join(" "), {}, async (err, stdout, stderr) => {
            const link = await client.Util.genSourcebin(stderr || stdout, msg.args.join(" "), "js", `Exec Output from ${client.user.tag}`, client.user.tag)
            await msg.reply(link)
        });
    }
}