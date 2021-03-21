"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_light_1 = require("discord.js-light");
class Message extends discord_js_light_1.Message {
    async send(content, options) {
        if (typeof content === "string") {
            if (!options) {
                options = {};
            }
            options.content = content;
        }
        else {
            options = content;
        }
        options.allowedMentions = { repliedUser: false };
        let sent;
        let previous = this.response;
        if (previous) {
            let msg = typeof this.channel.messages.forge === "function" ? this.channel.messages.forge(previous.id) : await this.channel.messages.fetch(previous.id, false);
            if (previous.attachments || options.files) {
                try {
                    await msg.delete();
                }
                catch { }
                sent = await this.reply(options);
            }
            else {
                if (previous.embeds && !options.embed) {
                    options.embed = null;
                }
                try {
                    sent = await msg.edit(options);
                }
                catch {
                    sent = await this.reply(options);
                }
            }
        }
        else {
            sent = await this.reply(options);
        }
        this.response = {
            id: sent.id,
            attachments: Boolean(sent.attachments.size),
            embeds: Boolean(sent.embeds.length),
            timestamp: Date.now()
        };
        return sent;
    }
}
exports.default = Message;
discord_js_light_1.Structures.extend("Message", M => class Message extends M {
    async send(content, options) {
        if (typeof content === "string") {
            if (!options) {
                options = {};
            }
            options.content = content;
        }
        else {
            options = content;
        }
        options.allowedMentions = { repliedUser: false };
        let sent;
        let previous = this.response;
        if (previous) {
            let msg = typeof this.channel.messages.forge === "function" ? this.channel.messages.forge(previous.id) : await this.channel.messages.fetch(previous.id, false);
            if (previous.attachments || options.files) {
                try {
                    await msg.delete();
                }
                catch { }
                sent = await this.reply(options);
            }
            else {
                if (previous.embeds && !options.embed) {
                    options.embed = null;
                }
                try {
                    sent = await msg.edit(options);
                }
                catch {
                    sent = await this.reply(options);
                }
            }
        }
        else {
            sent = await this.reply(options);
        }
        this.response = {
            id: sent.id,
            attachments: Boolean(sent.attachments.size),
            embeds: Boolean(sent.embeds.length),
            timestamp: Date.now()
        };
        return sent;
    }
});
