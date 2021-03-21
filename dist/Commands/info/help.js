"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("help", {
            description: "View the bot's commands, find out more info on a specific command, and receive some helpful links where you can receive support and find out more.",
            aliases: ["commands", "cmds", "links"],
            usage: "[command]"
        }, {
            owner: false,
            args: 0,
            permissions: {}
        });
        this.client = client;
    }
    async run(msg) {
        if (msg.args[0]) {
            const command = this.client.getCommand(msg.args[0].toLowerCase());
            if (!command || command.config.owner && !this.client.owner(msg.author.id))
                return await msg.send(`The command/alias \`${msg.args[0]}\` was not found`);
            let embed = {
                title: `Command Info - ${command.name.toProperCase()}`,
                description: command.info.description,
                fields: [
                    {
                        name: 'Information',
                        value: [
                            `Aliases: \`${command.info.aliases.join(", ") || "No Aliases"}\``,
                            `Usage: \`${command.name}${command.info.usage ? ` ${command.info.usage}` : ``}\``, `Required Args: \`${command.config.args || 0}\``,
                            `Cooldown: \`${command.config.cooldown || "No Cooldown"}\``,
                            `Category: \`${command.info.category.toProperCase()}\``
                        ]
                    },
                    {
                        name: 'Permissions Needed',
                        value: [
                            `Permissions needed for the User: \`${this.client.permissions[command.config.permissions.user] || "None"}\``,
                            `Permissions needed for the Bot: \`${this.client.permissions[command.config.permissions.bot] || "None"}\``
                        ]
                    }
                ],
                color: this.client.config.colours.main,
                footer: {
                    text: `Usage: <> is required and [] is optional`
                }
            };
            return await msg.send({ embed });
        }
        else {
            let categories = this.client.categories.filter(cat => cat != "owner");
            if (this.client.owner(msg.author.id))
                categories = this.client.categories;
            return await msg.send({
                embed: {
                    title: "Help & Information",
                    description: `Here you can find all of this bot's commands and some useful links too\nThe current prefix for this server is \`${msg.db.prefix}\`. Alternatively, you can use ${this.client.user} as a prefix.\nFor specific info on a command, type \`${msg.db.prefix}help <command>\`\nThere are currently ${this.client.owner(msg.author.id) ? this.client.commands.size : this.client.commands.filter(cmd => !cmd.config.owner).size} commands.`,
                    fields: [...categories.map(cat => {
                            const cmds = this.getCatCommands(cat);
                            return {
                                name: `${cat.toProperCase()} [${cmds.size}] `,
                                value: cmds.map(cmd => `\`${cmd.name}\``).join(", ") || "No commands"
                            };
                        }), {
                            name: "Links",
                            value: Object.keys(this.client.links).map(link => `[${link.toProperCase()}](${this.client.links[link]})`).join(" | ")
                        }],
                    color: this.client.config.colours.main
                }
            });
        }
    }
    getCatCommands(category) {
        return this.client.commands.filter(command => command.info.category == category);
    }
};
