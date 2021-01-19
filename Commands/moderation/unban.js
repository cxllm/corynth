const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message, User } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("unban", {
            help: {
                aliases: [],
                usage: "<user> [reason]",
                description: "Unban any user from your server"
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
        let mention = client.Util.handleMention(msg.args[0])
        let user;
        try {
            user = await client.users.fetch(mention, false);
        } catch {
            return await msg.reply(client.presets.invalid_user);
        }
        if (!user) return await msg.reply(client.presets.invalid_user);
        if (user.id === msg.author.id) return await msg.reply(`${client.config.emojis.cross} You can't unban yourself!`);
        let reason = msg.args.slice(1).join(" ") || client.presets.no_reason;
        try {
            await msg.guild.fetchBan(user);
        } catch {
            return await msg.reply(`This user is not banned!`)
        }
        await msg.guild.members.unban(user.id, reason);
        let embed = {
            title: "User Unbanned",
            description: `The user ${user.tag} has been unbanned for the reason: \`${reason}\``,
            color: client.config.colours.success
        }
        await msg.reply({ embed });
    }
}