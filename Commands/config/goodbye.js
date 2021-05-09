const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("goodbye", {
            help: {
                aliases: [],
                usage: "<on|off|view>",
                description: "Change the guild goodbye message channel or view the current settings"
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
        let arg = msg.args[0].toLowerCase();
        let channels;
        let m;
        let embed;
        let messages;
        switch (arg) {
            case "on":
                embed = {
                    description: `Please mention a channel below, or type its ID. You have 10 seconds`,
                    color: client.config.colours.main
                }
                m = await msg.reply({ embed })
                try {
                    channels = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {
                        max: 1,
                        time: 10000,
                        errors: ["time"]
                    });
                } catch {
                    return await m.edit("Timed out")
                }
                let chan = channels.first().mentions.channels.first() || await msg.guild.channels.fetch(channels.first().content, false);
                if (!chan || chan.type != "text") return await msg.reply(`${client.config.emojis.cross} Invalid Channel!`)
                embed = {
                    description: `Please type your leave message below. You have 60 seconds\nYou can use these variables:
                [tag] - For the user tag (e.g. ${msg.author.tag})
                [servername] - For the server name (e.g. ${msg.guild.name})
                [mention] - To mention/ping the user (e.g. ${msg.author})
                [members] - For the total member count of the server (e.g. ${msg.guild.memberCount})
                [username] - For the username (e.g. ${msg.author.username})`,
                    fields: [{
                        name: "Example",
                        value: `Goodbye [tag]! We hope you had a good time in [servername]! We now have [members] members\nGoodbye ${msg.author.tag}! We hope you had a good time in ${msg.guild.name}! We now have ${msg.guild.memberCount} members`
                    }],
                    color: client.config.colours.main
                }
                m = await msg.reply({ embed });
                try {
                    messages = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {
                        max: 1,
                        time: 60000,
                        errors: ["time"]
                    });
                } catch {
                    return await m.edit("Timed out")
                }
                msg.guild.options.leave = {
                    message: messages.first().content,
                    channel: chan.id
                };
                await client.db.Guilds.set(msg.guild.id, msg.guild.options);
                await msg.reply(`${client.config.emojis.tick} Leave message set!`)
                break;
            case "off":
                msg.guild.options.leave = {};
                await client.db.Guilds.set(msg.guild.id, msg.guild.options);
                await msg.reply(`${client.config.emojis.tick} Leave message turned off`)
                break;
            case "view":
                let leave = msg.guild.options.leave;
                embed = {
                    title: "Leave Message",
                    description: leave ? leave.message && leave.channel ? `The leave message is set to ${leave.message} & the channel is <#${leave.channel}> ` : `The leave message is off` : `The leave message is off`,
                    color: client.config.colours.main
                }
                await msg.reply({ embed })
                break;
            default:
                await msg.reply(client.UsageEmbed(this));
                break;
        }
    }
}