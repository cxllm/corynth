import { Role } from "discord.js";
import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("filter", {
            description: "Filter certain words from being sent. Bypassed by users with the Manage Server permission to allow for them to edit it",
            aliases: ["swear-filter"],
            usage: "<on | defaults | view [uncensored] | add <custom words/defaults> | remove [words/defaults] | off>"
        }, {
            owner: false,
            args: 1,
            permissions: {
                user: "MANAGE_GUILD",
                bot: "MANAGE_MESSAGES"
            }
        })
        this.client = client;
    }
    async run(msg: Message) {
        const defaults = ["fuck", "shit", "cunt", "bitch", "dick", "faggot", "nigga", "nigger"]
        const defaults_filtered = this.filter(defaults);
        const arg = msg.args[0].toLowerCase();
        let embed;
        let messages;
        let words: string[];
        switch (arg) {
            case "on":
                embed = {
                    description: `Would you like to add the default words (\`${defaults_filtered.join(", ")}\`)? [y/n] (default: yes)`,
                    color: this.client.config.colours.main
                }
                await msg.send({ embed });
                let option = "y"
                try {
                    messages = await msg.channel.awaitMessages(m => m.author.id == msg.author.id && ["y", "n"].includes(m.content.toLowerCase()), {
                        max: 1,
                        time: 15000,
                        errors: ["time"]
                    });
                } catch { }
                option = messages?.first()?.content?.toLowerCase() || option;
                msg.db.swear = option == "y" ? defaults : [];
                await this.client.db.guilds.set(msg.db.id, msg.db);
                return await msg.send(`${this.client.config.emojis.tick} Filter turned on ${option == "y" ? "and default words enabled" : ""}.`)
            case "defaults":
                embed = {
                    description: `The default words are: \`${defaults_filtered.join(", ")}\``,
                    color: this.client.config.colours.main
                }
                return await msg.send({ embed })
            case "view":
                if (!msg.db.swear) return await msg.send(`Please enable the filter before viewing it. You can do so by running \`${msg.db.prefix}${this.name} on\``)
                const uncensored = msg.args[1]?.toLowerCase() == "uncensored"
                embed = {
                    title: "Currently Filtered Words",
                    color: this.client.config.colours.main,
                    description: `\`${(uncensored ? msg.db.swear : this.filter(msg.db.swear)).join(", ")}\`` || "None",
                    footer: {
                        text: uncensored ? `` : `To view an uncensored version, run: ${msg.db.prefix}${this.name} view uncensored`
                    }
                }
                return await msg.send({ embed })
            case "add":
                words = msg.args.slice(1);
                if (!words[0]) return await msg.send(this.client.UsageEmbed(this));
                if (!msg.db.swear) return await msg.send(`Please enable the filter before adding words to it. You can do so by running \`${msg.db.prefix}${this.name} on\``);
                if (words[0].toLowerCase() == "defaults") words = defaults;
                words.map(word => {
                    if (msg.db.swear.includes(word.toLowerCase())) return;
                    msg.db.swear.push(word.toLowerCase())
                });
                await this.client.db.guilds.set(msg.db.id, msg.db);
                return await msg.send({
                    embed: {
                        title: "Added Words",
                        description: `I added the word${words.length > 1 ? "s" : ""} \`${this.filter(words).join(", ")}\` to the filter`,
                        color: this.client.config.colours.success
                    }
                })
            case "remove":
                words = msg.args.slice(1);
                if (!words[0]) return await msg.send(this.client.UsageEmbed(this));
                if (!msg.db.swear) return await msg.send(`Please enable the filter before removing words from it. You can do so by running \`${msg.db.prefix}${this.name} on\``);
                if (words[0].toLowerCase() == "defaults") words = defaults;
                words.map(word => {
                    word = word.toLowerCase();
                    let index = msg.db.swear.indexOf(word)
                    if (index < 0) return;
                    delete msg.db[index];
                });
                await this.client.db.guilds.set(msg.db.id, msg.db);
                return await msg.send({
                    embed: {
                        title: "Removed Words",
                        description: `I removed the word${words.length > 1 ? "s" : ""} \`${this.filter(words).join(", ")}\` from the filter`,
                        color: this.client.config.colours.success
                    }
                })
            case "off":
                msg.db.swear = null;
                await this.client.db.guilds.set(msg.db.id, msg.db);
                return await msg.send(`${this.client.config.emojis.tick} Filter turned off.`)
        }

    }
    filter(array: string[]) {
        return array.map(str => {
            let new_str: string[] | string = str.split("");
            delete new_str[new_str.length - 1]
            delete new_str[0]
            new_str = new_str.join("")
            let asterisks = "*".repeat(new_str.length);
            return str.replace(new_str, asterisks)
        })
    }
}