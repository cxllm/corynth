const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("reload", {
            help: {
                aliases: ["refresh"],
                usage: "<commands|events|util|config|presets|all>",
                description: "Reload sections of the bot"
            },
            config: {
                args: 1,
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
        const operator = msg.args[0].toLowerCase();
        switch (operator) {
            case "cmds":
            case "commands":
                client.handleCommands();
                msg.reply("Reloaded Commands")
                break;
            case "events":
                client.handleEvents();
                msg.reply("Reloaded Events")
                break;
            case "util":
                delete require.cache[require.resolve("../../Structs/Util")]
                client.Util = new (require("../../Structs/Util"))(client);
                msg.reply("Reloaded Util")
                break;
            case "config":
                delete require.cache[require.resolve("../../config.js")]
                client.config = require("../../config");
                msg.reply("Reloaded Config")
                break;
            case "presets":
                delete require.cache[require.resolve("../../presets.js")]
                client.presets = require("../../presets");
                delete require.cache[require.resolve("../../guildInfo.js")];
                client.guildInfo = require("../../guildInfo");
                msg.reply("Reloaded Presets")
                break;
            case "all":
                delete require.cache[require.resolve("../../Structs/Util")]
                client.Util = new (require("../../Structs/Util"))(client);
                client.handleEvents();
                client.handleCommands();
                delete require.cache[require.resolve("../../config")]
                client.config = require("../../config")
                delete require.cache[require.resolve("../../presets.js")]
                client.presets = require("../../presets");
                msg.reply("Reloaded Events, Commands, Config and Util")
                delete require.cache[require.resolve("../../guildInfo.js")];
                client.guildInfo = require("../../guildInfo");
                break;
            default:
                msg.reply("Invalid Options, the options are: commands, events, util, config, presets and all. They are not case sensitive")


        }
    }
}