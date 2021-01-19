const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("filter-list", {
            help: {
                aliases: [],
                usage: "",
                description: "Show a list of filters"
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
        let filters = client.commands.filter(c => c.config.filter);
        let embed = {
            title: "Filter Commands",
            description: filters.map(f => `**${f.name}** (${f.help.description}) - Usage: \`${msg.guild.options.prefix}${f.name} ${f.help.usage}\``).join("\n"),
            color: client.config.colours.main
        }
        await msg.reply({ embed });
    }
}