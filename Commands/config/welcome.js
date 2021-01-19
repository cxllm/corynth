const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("welcome", {
            help: {
                aliases: [],
                usage: "<on|off|view>",
                description: "Change the guild join message channel or view the current settings"
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
        let embed;
        let channels;
        let m;
        let messages;
        switch (arg) {
            case "on":
                embed = {
                    description: `Please mention a channel below, or type its ID. You have 10 seconds`,
                    color: client.config.colours.main
                }
                m = await msg.reply({ embed });
                try {
                    channels = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {
                        max: 1,
                        time: 10000,
                        errors: ["time"]
                    });
                } catch {
                    return await m.edit("Timed out")
                }
                let chan = channels.first().mentions.channels.first() || msg.guild.channels.cache.get(channels.first().content);
                if (!chan || chan.type != "text") return await msg.reply(`${client.config.emojis.cross} Invalid Channel!`)
                embed = {
                    description: `Please type your join message below. You have 60 seconds\nYou can use these variables:
                [tag] - For the user tag (e.g. ${msg.author.tag})
                [servername] - For the server name (e.g. ${msg.guild.name})
                [mention] - To mention/ping the user (e.g. ${msg.author})
                [members] - For the total member count of the server (e.g. ${msg.guild.memberCount})
                [username] - For the username (e.g. ${msg.author.username})`,
                    fields: [{
                        name: "Example",
                        value: `Welcome to [servername], [mention]! We now have [members] members\nWelcome to ${msg.guild.name}, ${msg.author}! We now have ${msg.guild.memberCount} members`
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
                msg.guild.options.join = {
                    message: messages.first().content,
                    channel: chan.id
                };
                await client.db.Guilds.set(msg.guild.id, msg.guild.options);
                await msg.reply(`${client.config.emojis.tick} Join message set!`)
                break;
            case "off":
                msg.guild.options.join = {};
                await client.db.Guilds.set(msg.guild.id, msg.guild.options);
                await msg.reply(`${client.config.emojis.tick} Join message turned off`)
                break;
            case "view":
                let join = msg.guild.options.join;
                embed = {
                    title: "Join Message",
                    description: join ? join.message && join.channel ? `The join message is set to ${join.message} & the channel is <#${join.channel}>` : `The join message is off` : `The join message is off`,
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