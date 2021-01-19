const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("restart", {
            help: {
                aliases: ["reboot"],
                usage: "",
                description: "Restart the bot"
            },
            config: {
                args: 0,
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
        const m = await msg.reply("Restarting")
        const content = m.content
        let dots = "."
        let i = 0;
        const interval = setInterval(async () => {
            if (i == 3) {
                clearInterval(interval);
                await m.edit(`${msg.author.tag}: Restarted!`)
                await process.exit();
            } else {
                await m.edit(`${content}${dots}`);
                dots += "."
            }
            i++;
        }, 1000)
    }
}