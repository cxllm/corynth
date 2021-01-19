const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("ownerprefix", {
            help: {
                aliases: [],
                usage: "",
                description: "Change the owner prefix setting"
            },
            config: {
                args: 0,
                permissions: {
                    user: false,
                    bot: false
                },
                owner: true,
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
        msg.guild.options.ownerprefix = msg.guild.options.ownerprefix ? false : true;
        await client.db.Guilds.set(msg.guild.id, msg.guild.options)
        await msg.reply(`Owner prefix has been ${msg.guild.options.ownerprefix ? "enabled" : "disabled"}`);
    }
}