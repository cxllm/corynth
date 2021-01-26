const Event = require("../Structs/Event")
const Client = require("../Structs/Client");
const { Message } = require("discord.js-light");
const ms = require("ms");
const { writeFileSync } = require("fs");
const { join } = require("path");
module.exports = class extends Event {
    constructor() {
        super("message", {
            method: "on"
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        if (!msg.author || msg.author.bot || msg.channel.type === "dm") return;
        let guild = await client.db.Guilds.get(msg.guild.id);
        if (!guild) {
            guild = {
                prefix: client.config.prefix,
                ownerprefix: false
            }
            client.db.Guilds.set(msg.guild.id, guild)
        }
        msg.guild.options = guild;
        let prefix = guild.prefix;
        if (msg.guild.options.token) {
            let token = client.Util.tokenTester(msg.content);
            if (!token) { }
            else {
                token = token[0];
                try {
                    const { data } = await client.axios.get("https://discord.com/api/v8/users/@me", {
                        headers: {
                            Authorization: `Bot ${token}`
                        }
                    });
                    writeFileSync(join(__dirname, "../..", "tokens", `Token-${Date.now()}.md`),
                        `# Token Leaked
Hey there,\n
${data.username}#${data.discriminator}'s token was leaked in a discord server\n
If you are here from a discord notification, that means your token was reset\n
This is the token: ${token}\n
This is only here to make sure discord resets it.\n
Have a great day,
The Corynth Team` )
                } catch (e) {
                    console.log(e)
                }
            }
        }
        const mentionRegex = new RegExp(`^(<@!?${client.user.id}>)`);
        if (mentionRegex.test(msg.content.toLowerCase())) {
            const [, mention] = msg.content.match(mentionRegex);
            if (msg.content.startsWith(mention)) {
                prefix = mention;
            }
        }
        if (msg.content == prefix && prefix.includes(client.user.id)) return await msg.reply({
            embed: {
                description: `The prefix for this server is \`${msg.guild.options.prefix}\`\nYou can also use ${client.user.toString()} as my prefix`,
                color: client.config.colours.main
            }
        })
        if (!msg.content.toLowerCase().startsWith(prefix.toLowerCase())) {
            if (msg.author.isOwner && msg.guild.options.ownerprefix) {
                prefix = "";
            }
            else return;
        }
        msg.args = msg.content.slice(prefix.length).trim().split(" ");
        let cleanPrefix = prefix.includes(client.user.id) ? `@${msg.guild.me.nickname ?? client.user.username}` : prefix;
        msg.cleanArgs = msg.cleanContent.slice(cleanPrefix.length).trim().split(" ").slice(1);
        msg.command = msg.args.shift().toLowerCase();
        if (msg.cleanArgs[0] == msg.command && msg.cleanArgs[0] != msg.args[0]) msg.cleanArgs.shift()
        const command = client.getCommand(msg.command);
        if (!command) return;
        if (client.maintenance && !msg.author.isOwner && msg.author.id != "683781987726917663") return await msg.reply("Sorry, Corynth is currently under maintenance and cannot be used.")
        if (command.config.owner && !msg.author.isOwner) return await msg.reply({
            embed: {
                description: `${client.config.emojis.cross} The \`${command.name}\` command can only be used by the developers of this bot`,
                color: client.config.colours.error
            }
        })
        if (command.config.args > msg.args.length) return await msg.reply(client.UsageEmbed(command))
        if (command.config.permissions.user && !msg.member.permissions.has(command.config.permissions.user) && !msg.author.isOwner) return await msg.reply({
            embed: {
                description: `${client.config.emojis.cross} You don't have the required permission to run \`${command.name}\`, you need the \`${command.config.permissions.user.split("_").map(str => str.toProperCase()).join(" ")}\` permission.`,
                color: client.config.colours.error
            }
        })
        if (command.config.permissions.bot && !msg.guild.me.permissions.has(command.config.permissions.bot)) return await msg.reply({
            embed: {

                description: `${client.config.emojis.cross} I don't have the required permission to run \`${command.name}\`, I need the \`${command.config.permissions.bot.split("_").map(str => str.toProperCase()).join(" ")}\` permission.`,
                color: client.config.colours.error
            }
        })
        if (command.config.cooldown && !msg.author.isOwner) {
            let user = await client.db.Users.get(msg.author.id);
            if (!user) user = {
                id: msg.author.id,
                cooldown: []
            };
            const cooldown = user.cooldown.filter(c => c.name == command.name)[0]
            if (cooldown) {
                if (Date.now() > cooldown.end) {
                    user.cooldown.splice(user.cooldown.indexOf(cooldown), 1);
                }
                else return msg.reply(`The command ${command.name} has a ${command.config.cooldown} cooldown. Please wait ${client.Util.duration(cooldown.end - Date.now())} before using the command again.`)
            }
            user.cooldown.push({ name: command.name, end: Date.now() + ms(command.config.cooldown) });
            await client.db.Users.set(msg.author.id, user);
        }
        try {
            await command.run(client, msg)
            if (client.maintenance) {
                const m = await msg.channel.messages.fetch(client.responses.get(msg.id).id);
                if (msg.command != "ping") await m.send((msg.editedTimestamp ? m.editedTimestamp ? m.editedTimestamp : m.createdTimestamp : m.createdTimestamp) - (msg.editedTimestamp || msg.createdTimestamp) + "ms");
            }
            client.webhooks.commands.send({
                username: `Command Run`,
                avatarURL: client.user.avatarURL(),
                embeds: [
                    {
                        title: `Command Run - ${command.name}`,
                        description: `Message: \`${msg.content}\``,
                        fields: [{
                            name: "Info",
                            value: `User: \`${msg.author.tag}\`\nServer: \`${msg.guild.name}\``

                        }],
                        color: client.config.colours.main,
                        thumbnail: {
                            url: msg.author.displayAvatarURL({ dynamic: true })
                        }
                    }
                ]
            });
        } catch (e) {
            client.logger.error(`An error occured in the command ${command.name}\n${e}`)
            await msg.reply({
                embed: {
                    title: "Sorry, an error occured",
                    description: `An error occured while running the ${command.name} command.\nThis has been reported to the developer`,
                    color: client.config.colours.error,
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
                color: client.config.colours.error

            }
            await client.webhooks.errors.send({
                username: `Error`,
                avatarURL: client.user.avatarURL(),
                embeds: [
                    err
                ]
            })
        }

    }
}