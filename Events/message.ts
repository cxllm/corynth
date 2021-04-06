import Event from "../Structs/Event";
import Client from "../Structs/Client";
import Message from "../Structs/Message";
import ms from "ms";
import { writeFileSync } from "fs";
import { join } from "path";
import permissions from "../permissions";
export = class extends Event {

    constructor(client: Client) {
        super(client, "message", "on");
    }
    async run(msg: Message) {
        if (msg.author.bot) return;
        let guild = await this.client.db.guilds.get(msg.guild.id);
        if (!guild) {
            guild = {
                prefix: this.client.config.prefix
            };
            this.client.db.guilds.set(msg.guild.id, guild);
        }
        msg.db = guild;
        if (msg.db.swear && !msg.member.permissions.has("MANAGE_GUILD")) {
            for (const word of msg.db.swear) {
                if (msg.content.toLowerCase().includes(word.toLowerCase())) {
                    await msg.delete();
                    const m = await msg.channel.send(`${msg.author}, you can't say that word here.`);
                    setTimeout(async () => {
                        await m.delete();
                    }, 2000)
                    return;
                } continue;
            }
        }
        let prefix = guild.prefix;
        const mentionRegex = new RegExp(`^(<@!?${this.client.user.id}>)`);
        if (mentionRegex.test(msg.content.toLowerCase())) {
            const [, mention] = msg.content.match(mentionRegex);
            if (msg.content.startsWith(mention)) {
                prefix = mention;
            }
        };
        if (msg.content == prefix && prefix.includes(this.client.user.id)) return await msg.send({
            embed: {
                description: `The prefix for this server is \`${guild.prefix}\` or ${this.client.user.toString()}.`,
                color: this.client.config.colours.main
            }
        });
        if (!msg.content.toLowerCase().startsWith(prefix.toLowerCase())) return;
        msg.args = msg.content.slice(prefix.length).trim().split(" ");
        let cmd = msg.args.shift().toLowerCase();
        let command = this.client.getCommand(cmd);
        if (!command) return;
        if (command.config.owner && !this.client.owner(msg.author.id)) return;
        if (command.config.args > msg.args.length) return await msg.send(this.client.UsageEmbed(command));
        if (command.config.permissions.user &&
            !msg.member.permissions.has(command.config.permissions.user)
            && !this.client.owner(msg.author.id)) return await msg.reply({
                embed: {
                    description: `${this.client.config.emojis.cross} You don't have the required permission to run \`${command.name}\`, you need the \`${permissions[command.config.permissions.user]}\` permission.`,
                    color: this.client.config.colours.error
                }
            });
        if (command.config.permissions.bot &&
            !msg.guild.me.permissions.has(command.config.permissions.bot)) return await msg.reply({
                embed: {
                    description: `${this.client.config.emojis.cross} I don't have the required permission to run \`${command.name}\`, I need the \`${permissions[command.config.permissions.bot]}\` permission.`,
                    color: this.client.config.colours.error
                }
            })
        if (command.config.cooldown && !this.client.owner(msg.author.id)) {
            let user = await this.client.db.users.get(msg.author.id);
            if (!user) user = {
                id: msg.author.id,
                cooldown: []
            };
            const cooldown = user.cooldown.filter(c => c.name == command.name)[0];
            if (cooldown) {
                if (Date.now() > cooldown.end) {
                    user.cooldown.splice(user.cooldown.indexOf(cooldown), 1);
                }
                else return msg.reply(`The command ${command.name} has a ${command.config.cooldown} cooldown. Please wait ${this.client.Util.duration(cooldown.end - Date.now())} before using the command again.`)
            }
            user.cooldown.push({ name: command.name, end: Date.now() + ms(command.config.cooldown) });
            await this.client.db.users.set(msg.author.id, user);
        }
        try {
            await command.run(msg);
        } catch (e) {
            await msg.send({
                embed: {
                    title: "Sorry, an error occured",
                    description: `An error occured while running the ${command.name} command.\nThis has been reported to the developer`,
                    color: this.client.config.colours.error,
                    fields: [
                        {
                            name: "Details", value: "```js\n" + e + "```"
                        }
                    ]
                }
            })
            let err = {
                title: "An Error Occured",
                description: `An error occured while running the ${command.name} command.`,
                fields: [
                    {
                        name: "Details",
                        value: [`User: ${msg.author.tag}`, `Content: ${msg.content}`]
                    },
                    {
                        name: "Error",
                        value: "```js\n" + e + "```"
                    }
                ],
                color: this.client.config.colours.error

            }
            await this.client.webhooks.errors.send({
                username: `Error`,
                avatarURL: this.client.user.avatarURL(),
                embeds: [
                    err
                ]
            })
        }
    }
}
