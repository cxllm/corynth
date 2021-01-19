const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("maintenance", {
            help: {
                aliases: [],
                usage: "",
                description: "Enables or disables maintenance mode"
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
        client.maintenance = client.maintenance ? false : true;
        await msg.reply(`Maintenance mode has been ${client.maintenance ? "enabled" : "disabled"}`);
    }
}