"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("welcome", {
            description: "Configure the welcome message for your server.",
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
        let embed;
        let channels;
        let m;
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
                let chan = channels.first().mentions.channels.first() || msg.guild.channels.cache.get(channels.first().content);
                if (!chan || chan.type != "text")
                    return await msg.send(`${this.client.config.emojis.cross} Invalid Channel!`);
                embed = {
                    description: `Please type your join message below. You have 60 seconds\nYou can use these variables:
                [tag] - For the user tag (e.g. ${msg.author.tag})
                [servername] - For the server name (e.g. ${msg.guild.name})
                [mention] - To mention/ping the user (e.g. ${msg.author})
                [members] - For the total member count of the server (e.g. ${msg.guild.memberCount})
                [username] - For the username (e.g. ${msg.author.username})
                [place] - For the place the user joined in (e.g. 5th)`,
                    fields: [{
                            name: "Example",
                            value: `Welcome to [servername], [mention]! We now have [members] members\nWelcome to ${msg.guild.name}, ${msg.author}! We now have ${msg.guild.memberCount} members`
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
                msg.db.join = {
                    message: messages.first().content,
                    channel: chan.id
                };
                await this.client.db.guilds.set(msg.guild.id, msg.db);
                await msg.send(`${this.client.config.emojis.tick} Join message set!`);
                break;
            case "off":
                msg.db.join = {};
                await this.client.db.guilds.set(msg.guild.id, msg.db);
                await msg.send(`${this.client.config.emojis.tick} Join message turned off`);
                break;
            case "view":
                let join = msg.db.join;
                embed = {
                    title: "Join Message",
                    description: join ? join.message && join.channel ? `The join message is set to \`${join.message}\` & the channel is <#${join.channel}>` : `The join message is off` : `The join message is off`,
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
