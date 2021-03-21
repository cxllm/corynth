"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("goodbye", {
            description: "Configure the goodbye message for your server.",
            aliases: [],
            usage: "<on|off|view>"
        }, {
            owner: false,
            args: 1,
            permissions: {
                user: "MANAGE_GUILD"
            }
        });
        this.client = client;
    }
    async run(msg) {
        let arg = msg.args[0].toLowerCase();
        let channels;
        let m;
        let embed;
        let messages;
        switch (arg) {
            case "on":
                embed = {
                    description: `Please mention a channel below, or type its ID. You have 15 seconds`,
                    color: this.client.config.colours.main
                };
                m = await msg.send({ embed });
                try {
                    channels = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {
                        max: 1,
                        time: 15000,
                        errors: ["time"]
                    });
                }
                catch {
                    return await m.edit("Timed out");
                }
                let chan = channels.first().mentions.channels.first() || await msg.guild.channels.fetch(channels.first().content, false);
                if (!chan || chan.type != "text")
                    return await msg.send(`${this.client.config.emojis.cross} Invalid Channel!`);
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
                    color: this.client.config.colours.main
                };
                m = await msg.send({ embed });
                try {
                    messages = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {
                        max: 1,
                        time: 60000,
                        errors: ["time"]
                    });
                }
                catch {
                    return await m.edit("Timed out");
                }
                msg.db.leave = {
                    message: messages.first().content,
                    channel: chan.id
                };
                await this.client.db.guilds.set(msg.guild.id, msg.db);
                await msg.send(`${this.client.config.emojis.tick} Leave message set!`);
                break;
            case "off":
                msg.db.leave = {};
                await this.client.db.guilds.set(msg.guild.id, msg.db);
                await msg.send(`${this.client.config.emojis.tick} Leave message turned off`);
                break;
            case "view":
                let leave = msg.db.leave;
                embed = {
                    title: "Leave Message",
                    description: leave ? leave.message && leave.channel ? `The leave message is set to \`${leave.message}\` & the channel is <#${leave.channel}> ` : `The leave message is off` : `The leave message is off`,
                    color: this.client.config.colours.main
                };
                await msg.send({ embed });
                break;
            default:
                await msg.send(this.client.UsageEmbed(this));
                break;
        }
    }
};
