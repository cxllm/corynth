import { Role } from "discord.js";
import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("autorole", {
            description: "Configure the autoroles for your server.",
            aliases: [],
            usage: "<bot|user> <role id|mention|off>"
        }, {
            owner: false,
            args: 2,
            permissions: {
                user: "MANAGE_GUILD",
                bot: "MANAGE_ROLES"
            }
        })
        this.client = client;
    }
    async run(msg: Message) {
        const arg = msg.args[0].toLowerCase();
        let role: Role = msg.mentions.roles.first() || msg.guild.roles.cache.get(msg.args[1]);
        //@ts-expect-error
        if (msg.args[1].toLowerCase() == "off") role = { id: null }
        if (role.managed && role.id) return await msg.send(`${this.client.config.emojis.cross} This an automatically created role and I can't assign it!`);
        if (role.id && role.position >= msg.guild.me.roles.highest.position) return await msg.send(`${this.client.config.emojis.cross} This role is equal to or greater than my role, so I can't assign it!`)
        switch (arg) {
            case "bot":
                if (!msg.db.autorole) msg.db.autorole = {
                    bot: role.id
                }; else msg.db.autorole.bot = role.id;
                await this.client.db.guilds.set(msg.guild.id, msg.db);
                return await msg.send(role.id ? `${this.client.config.emojis.tick} Bot autorole set to \`${role.name}\`` : `${this.client.config.emojis.tick} Bot autorole turned off`);
            case "user":
                if (!msg.db.autorole) msg.db.autorole = {
                    user: role.id
                }; else msg.db.autorole.user = role.id;
                await this.client.db.guilds.set(msg.guild.id, msg.db);
                return await msg.send(role.id ? `${this.client.config.emojis.tick} User autorole set to \`${role.name}\`` : `${this.client.config.emojis.tick} User autorole turned off`);
            default:
                return await msg.send(this.client.UsageEmbed(this));
        }

    }
}