const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message, User } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("ban", {
            help: {
                aliases: [],
                usage: "<user> [reason]",
                description: "Ban any user from your server"
            },
            config: {
                args: 1,
                permissions: {
                    user: "BAN_MEMBERS",
                    bot: "BAN_MEMBERS"
                },
                owner: false,
                cooldown: false
            }
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        let mention = client.Util.handleMention(msg.args[0]);
        if (!mention) return await msg.reply(client.presets.invalid_user);
        let user;
        try {
            user = await client.Util.getPunishmentUser(msg, mention);
        } catch {
            return await msg.reply(client.presets.invalid_user);
        }
        if (!user) return await msg.reply(client.presets.invalid_user);
        if (user.id === msg.author.id) return await msg.reply(`${client.config.emojis.cross} You can't ban yourself!`);
        let reason = msg.args.slice(1).join(" ") || client.presets.no_reason;
        if (user instanceof User) { }
        else {
            const punishable = client.Util.canPunish(user, msg.member);
            if (!punishable) return await msg.reply(`${client.config.emojis.cross} You can't ban this person because their position is equal to or greater than yours!`);
            if (!user.bannable) return await msg.reply(`${client.config.emojis.cross} I can't ban this person because their position is equal to or greater than mine!`);

            try { await user.send(`You have been banned from ${msg.guild.name} for \`${reason}\``); } catch { }
            user = user.user;
        }
        try {
            await msg.guild.members.ban(user.id, { reason });
        } catch {
            return await msg.reply(`${client.config.emojis.cross} I can't ban this person because their position is equal to or greater than mine!`);
        }
        let embed = {
            title: "User Banned",
            description: `The user ${user.tag} has been banned for the reason: \`${reason}\``,
            color: client.config.colours.success
        }
        await msg.reply({ embed });
    }
}