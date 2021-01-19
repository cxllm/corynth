const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("prefix", {
            help: {
                aliases: [],
                usage: "<new prefix|clear>",
                description: "Change the guild prefix"
            },
            config: {
                args: 1,
                permissions: {
                    user: "MANAGE_GUILD",
                    bot: false
                },
                owner: false,
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
        if (msg.args[0].toLowerCase() === "clear") {
            msg.guild.options.prefix = client.config.prefix;

            await client.db.Guilds.set(msg.guild.id, msg.guild.options);
            await msg.reply({
                embed: {
                    title: "Prefix Reset",
                    description: `${client.config.emojis.tick} Prefix reset to \`${client.config.prefix}\``,
                    color: client.config.colours.success
                }
            });
        } else {
            msg.guild.options.prefix = msg.args[0];
            await client.db.Guilds.set(msg.guild.id, msg.guild.options);
            await msg.reply({
                embed: {
                    title: "Prefix Set",
                    description: `${client.config.emojis.tick} Prefix set to \`${msg.args[0]}\``,
                    color: client.config.colours.success
                }
            })
        }
    }
}