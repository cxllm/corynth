const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("circle", {
            help: {
                aliases: ["cicrular"],
                usage: "[image/user]",
                description: "Make a user's avatar or an image circular"
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
        await msg.reply(client.config.emojis.loading);
        const url = await client.Util.getMessageImage(msg);
        let data = await client.canva.circle(url);
        await msg.reply({
            files: [
                {
                    attachment: data,
                    name: 'circle.png'
                }
            ]
        })

    }
}