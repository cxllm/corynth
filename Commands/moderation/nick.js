const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message, User } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("nick", {
            help: {
                aliases: ["nickname"],
                usage: "<user> <nick>",
                description: "Give someone a nickname"
            },
            config: {
                args: 2,
                permissions: {
                    user: "MANAGE_NICKNAMES",
                    bot: "MANAGE_NICKNAMES"
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
        let user = msg.guild.members.cache.get(mention);
        if (!user) return await msg.reply(client.presets.invalid_user);
        const punishable = client.Util.canPunish(user, msg.member);
        if (!punishable.user) return await msg.reply(`${client.config.emojis.cross} You can't nickname this person because their position is equal to or greater than yours!`);
        if (!punishable.bot) return await msg.reply(`${client.config.emojis.cross} I can't nickname this person because their position is equal to or greater than mine!`);
        const nickname = msg.args.slice(1).join(" ")
        if (nickname.length > 32) return await msg.reply("A nickname can't be longer than 32 characters!");
        await user.setNickname(nickname);
        let embed = {
            title: "Nickname Changed",
            description: `${user.user.tag}'s new nickname is now ${nickname}`,
            color: client.config.colours.success
        }
        await msg.reply({ embed });
    }
}