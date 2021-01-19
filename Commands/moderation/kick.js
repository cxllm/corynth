const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message, User } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("kick", {
            help: {
                aliases: [],
                usage: "<user> [reason]",
                description: "Kick a user from your server"
            },
            config: {
                args: 1,
                permissions: {
                    user: "KICK_MEMBERS",
                    bot: "KICK_MEMBERS"
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
        let mention = client.Util.handleMention(msg.args[0])
        if (!mention) return await msg.reply(client.presets.invalid_user);
        let user = await client.Util.getPunishmentUser(msg, mention);
        if (!user) return await msg.reply(client.presets.invalid_user);
        if (user.id === msg.author.id) return await msg.reply(`${client.config.emojis.cross} You can't kick yourself!`);
        let reason = msg.args.slice(1).join(" ") || client.presets.no_reason;
        const punishable = client.Util.canPunish(user, msg.member);
        if (!punishable) return await msg.reply(`${client.config.emojis.cross} You can't kick this person because their position is equal to or greater than yours!`);
        if (!user.kickable) return await msg.reply(`${client.config.emojis.cross} I can't kick this person because their position is equal to or greater than mine!`);
        user.send(`You have been kicked from ${msg.guild.name} for \`${reason}\``);
        try {
            await user.kick();
        } catch {
            return await msg.reply(`${client.config.emojis.cross} I can't kick this person because their position is equal to or greater than mine!`);
        }
        let embed = {
            title: "User Kicked",
            description: `The user ${user.user.tag} has been kicked for the reason: \`${reason}\``,
            color: client.config.colours.success
        }
        await msg.reply({ embed });
    }
}