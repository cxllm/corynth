const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("help", {
            help: {
                aliases: ["commands", "cmds"],
                usage: "[command]",
                description: "View the bot's commands and find specific info on them"
            },
            config: {
                args: false,
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
        if (msg.args[0]) {
            const cmd = client.getCommand(msg.args[0].toLowerCase());
            if (!cmd || cmd.config.owner && !msg.author.isOwner) return await msg.reply({
                embed: {
                    description: `${client.config.emojis.cross} I couldn't find a command with the name \`${msg.args[0]}\``,
                    color: client.config.colours.error
                }
            });
            let fields = [];
            fields.push({
                name: "Name",
                value: cmd.name.toProperCase(),
                inline: true
            })
            fields.push({
                name: "Description",
                value: cmd.help.description,
                inline: true
            })
            fields.push({
                name: "Usage",
                value: `${cmd.name} ${cmd.help.usage}`,
                inline: true
            })
            fields.push({
                name: "Minimum Required Args",
                value: cmd.config.args ? cmd.config.args : "None",
                inline: true
            })
            fields.push({
                name: "Required User Permissions",
                value: cmd.config.permissions.user ? cmd.config.permissions.user.split("_").map(str => str.toProperCase()).join(" ") : "None",
                inline: true
            })
            fields.push({
                name: "Required Bot Permissions",
                value: cmd.config.permissions.bot ? cmd.config.permissions.bot.split("_").map(str => str.toProperCase()).join(" ") : "None",
                inline: true
            })
            fields.push({
                name: "Vote Locked",
                value: cmd.config.vote ? "Yes" : "No",
                inline: true
            })
            fields.push({
                name: "Aliases",
                value: cmd.help.aliases.length > 0 ? cmd.help.aliases.map(alias => `\`${alias}\``).join(", ") : "No Aliases",
                inline: true
            })
            fields.push({
                name: "Category",
                value: cmd.config.category.toProperCase(),
                inline: true
            })
            msg.reply({
                embed: {
                    title: `Command Info - ${cmd.name}`,
                    color: client.config.colours.main,
                    fields,
                    footer: {
                        text: "Usage: <> is required and [] is optional"
                    }
                }
            })
        } else {
            let categories = client.categories.filter(cat => cat != "owner");
            if (msg.author.isOwner) categories = client.categories;
            await msg.reply({
                embed: {
                    title: "Help Menu",
                    description: `Here you can find the bot's commands and some useful links.\nThe prefix for this server is \`${msg.guild.options.prefix}\` or you can use ${client.user}\nFor specific info on a command, type \`${msg.guild.options.prefix}help <command>\`\nThere is a total of ${msg.author.isOwner ? client.commands.size : client.commands.filter(cmd => cmd.config.category != "owner").size} commands\nYou can edit your message to change the command, example [here](https://i.imgur.com/90PNEy2.gif)`,
                    color: client.config.colours.main,
                    fields: [...categories.map(cat => {
                        const cmds = this.getCategoryCommands(cat, client.commands);
                        return {
                            name: `${cat.toProperCase()} [${cmds.size}] `,
                            value: cmds.map(cmd => `\`${cmd.name}\``).join(", ") || "No commands"
                        }
                    }), {
                        name: "Links",
                        value: Object.keys(client.links).map(key => `[${key.toProperCase()}](${client.links[key]})`).join(" | ")
                    }]
                }
            })

        }
    }
    getCategoryCommands(cat, commands) {
        return commands.filter(command => command.config.category == cat);
    }
}