const { Structures } = require("discord.js-light");
require("discord.js").version = require("./package.json").dependencies["discord.js"].slice(1)

Structures.extend("Message", (M) => {
    return class Message extends M {
        /**
            * @type {Array}
            */
        args;
        async send(content, options) {
            if (typeof content === "string") {
                if (!options) { options = {}; }
                options.content = content;
            } else {
                options = content;
            }
            let sent;
            let previous = this.client.responses.get(this.id);
            if (previous) {
                let msg = typeof this.channel.messages.forge === "function" ? this.channel.messages.forge(previous.id) : await this.channel.messages.fetch(previous.id, false);
                if (previous.attachments || options.files) {
                    try {
                        await msg.delete()
                    } catch { }
                    sent = await this.channel.send(options);
                } else {
                    if (previous.embeds && !options.embed) {
                        options.embed = null;
                    }
                    try {
                        sent = await msg.edit(options);
                    } catch {
                        sent = await this.channel.send(options);
                    }
                }
            } else {
                sent = await this.channel.send(options);
            }
            this.client.responses.set(this.id, {
                id: sent.id,
                attachments: Boolean(sent.attachments.size),
                embeds: Boolean(sent.embeds.length),
                timestamp: Date.now()
            });
            return sent;
        }
        delete(options) {
            super.delete(options);
            this.client.responses.delete(this.id);
        }
        async reply(content, options) {
            if (typeof content === "string") {
                if (!options) { options = {}; }
                content = `${this.author.tag}: ${content}`
            } else {
                options = content;
                content = `${this.author.tag}: ${options.content ?? ""}`
            }

            return await this.send(content, options)
        }
    }
});
Structures.extend("User", U => class User extends U {
    get isOwner() {
        return this.client.config.owners.includes(this.id)
    }
})
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};