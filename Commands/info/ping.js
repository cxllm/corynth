const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("ping", {
            help: {
                aliases: [],
                usage: "",
                description: "Find out bot latency"
            },
            config: {
                args: 0,
                permissions: {
                    user: false,
                    bot: false
                },
                owner: false,
                cooldown: false
            }
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        const m = await msg.reply("Calculating...");
        const latency = (m.editedTimestamp || m.createdTimestamp) - (msg.editedTimestamp || msg.createdTimestamp);
        let embed = {
            title: "Latency",
            description: `Message Response Time is ${Math.round(latency)} ms\nDiscord API response time is ${Math.round(client.ws.ping)} ms`,
            color: client.config.colours.main,
            thumbnail: {
                url: client.user.avatarURL()
            }
        }
        await msg.reply({ embed })
    }
}