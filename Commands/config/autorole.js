const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("autorole", {
            help: {
                aliases: [],
                usage: "<bot|user> <role id|mention|off>",
                description: "Edit autorole settings"
            },
            config: {
                args: 2,
                permissions: {
                    user: "MANAGE_GUILD",
                    bot: "MANAGE_ROLES"
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
        const arg = msg.args[0].toLowerCase();
        let autoroles;
        let role = msg.mentions.roles.first() || msg.guild.roles.cache.get(msg.args[1]);
        if (msg.args[1].toLowerCase() === "off") role = {
            id: false
        };
        if (!role) return await msg.reply(client.presets.invalid_role)
        if (role.managed && role.id) return await msg.reply(`${client.config.emojis.cross} This an automatically created role and I can't assign it!`);
        if (role.position >= msg.guild.me.roles.highest && role.id) return await msg.reply(`${client.config.emojis.cross} This role is equal to or greater than my role, so I can't assign it!`)
        switch (arg) {
            case "bot":
                autoroles = msg.guild.options.autorole;

                if (!autoroles) autoroles = {
                    bot: role.id
                };
                else autorole.bot = role.id;
                msg.guild.options.autorole = autoroles;
                await client.db.Guilds.set(msg.guild.id, msg.guild.options);
                await msg.reply(role.id ? `${client.config.emojis.tick} Bot autorole set to \`${role.name}\`` : `${client.config.emojis.tick} Bot autorole turned off`);
                break;
            case "user":
                autoroles = msg.guild.options.autorole;
                if (!autoroles) autoroles = {
                    user: role.id
                };
                else autoroles.user = role.id;
                msg.guild.options.autorole = autoroles;
                await client.db.Guilds.set(msg.guild.id, msg.guild.options);
                await msg.reply(role.id ? `${client.config.emojis.tick} User autorole set to \`${role.name}\`` : `${client.config.emojis.tick} User autorole turned off`);
                break;
            default:
                await msg.reply(client.UsageEmbed(this))
                break;
        }
    }
}