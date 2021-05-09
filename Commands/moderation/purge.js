const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message, User } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("purge", {
            help: {
                aliases: ["clear", "prune"],
                usage: "<number of messages>",
                description: "Delete up to 100 messages in a channel"
            },
            config: {
                args: 1,
                permissions: {
                    user: "MANAGE_MESSAGES",
                    bot: "MANAGE_MESSAGES"
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
        let count = parseInt(msg.args[0]);
        await msg.delete()
        if (isNaN(count) || 0 >= count || 100 < count) return await msg.reply("Please enter a valid number between 1 and 100");
        let purged = (await msg.channel.bulkDelete(count, true)).size
        let embed = {
            title: `Messages Purged`,
            description: `A total of ${purged} messages were purged.`,
            footer: {
                text: `If this is not equal to the amount requested, this may be because of messages being older than 2 weeks or there not being this many messages`
            },
            color: client.config.colours.success
        }
        const m = await msg.reply({ embed });
        setTimeout(() => {
            m.delete()
        }, 3000)
    }
}