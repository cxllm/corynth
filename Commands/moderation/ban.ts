import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { User, GuildMember } from "discord.js-light"
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("ban", {
            description: "Ban any user from your server.",
            aliases: [],
            usage: "<user> [reason]"
        }, {
            owner: false,
            args: 1,
            permissions: {
                bot: "BAN_MEMBERS",
                user: "BAN_MEMBERS"
            }
        })
        this.client = client;
    }
    async run(msg: Message) {
        let mention = this.client.Util.handleMention(msg.args[0]);
        if (!mention) return await msg.send(this.client.presets.invalid_user);
        let user: GuildMember | User;
        try {
            user = await this.client.Util.getPunishmentUser(msg, mention, true);
        } catch {
            return await msg.send(this.client.presets.invalid_user);
        }
        if (!user) return await msg.send(this.client.presets.invalid_user);
        if (user.id === msg.author.id) return await msg.send(`${this.client.config.emojis.cross} You can't ban yourself!`);
        let reason = msg.args.slice(1).join(" ") || this.client.presets.no_reason;
        if (user instanceof User) { }
        else {
            if ((msg.member.roles.highest.position <= user.roles.highest.position || user.id == msg.guild.ownerID) && msg.guild.ownerID != msg.member.id) return await msg.send(`${this.client.config.emojis.cross} You can't ban this person because their position is equal to or greater than yours!`);
            if (!user.bannable) return await msg.send(`${this.client.config.emojis.cross} I can't ban this person because their position is equal to or greater than mine!`);

        }
        try {
            await msg.guild.members.ban(user.id, { reason });
            try { await user.send(`You have been banned from ${msg.guild.name} for the reason: \`${reason}\``); } catch { }
            user = user instanceof User ? user : user.user;
        } catch {
            return await msg.send(`${this.client.config.emojis.cross} I can't ban this person because their position is equal to or greater than mine!`);
        }
        let embed = {
            title: "User Banned",
            description: `The user ${user.tag} has been banned for the reason: \`${reason}\``,
            color: this.client.config.colours.success
        }
        await msg.send({ embed });
    }
}