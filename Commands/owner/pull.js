const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
const { exec } = require("child_process")
module.exports = class extends Command {
    constructor() {
        super("pull", {
            help: {
                aliases: ["git"],
                usage: "",
                description: "Pull latest update from github"
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
        await exec(`git fetch --all && git reset --hard origin/main`)
        return await msg.reply(`Latest update pulled using hard reset, please reload/restart for changes to take affect`)
    }
}