const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("user", {
            help: {
                aliases: ["ui", "userinfo"],
                usage: "[user]",
                description: "Find out info about yourself or another user"
            },
            config: {
                args: false,
                permissions: {
                    user: false,
                    bot: false
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
        await msg.reply(client.config.emojis.loading);
        const member = await client.Util.getMember(msg)
        const user = member.user;
        const avatar = user.displayAvatarURL({ dynamic: true, format: "png" });
        const permissions = member.permissions.toArray().map(perm => "`" + perm.split("_").map(str => str.toProperCase()).join(" ") + "`") || "No permissions";
        const embed = {
            title: `User Info - ${user.tag}`,
            fields: [
                {
                    name: "Basic Info", value: [
                        `Username: \`${user.username}\``,
                        `Discriminator:\`${user.discriminator}\``,
                        `ID: \`${user.id}\``,
                        `Is a Bot: \`${user.bot ? "Yes" : "No"}\``,
                        `Created At (UTC): \`${client.Util.utcDate(user.createdTimestamp)}, ${client.Util.durationAgo(Date.now() - user.createdTimestamp)} ago\``,
                        `[Avatar URL](${avatar}) | [Default Avatar URL](${user.defaultAvatarURL})`
                    ]
                },
                {
                    name: "Server Specific Info", value: [
                        `Nickname: \`${member.nickname ?? "No Nickname"}\``,
                        `Joined At (UTC): \`${client.Util.utcDate(member.joinedTimestamp)}, ${client.Util.durationAgo(Date.now() - member.joinedTimestamp)} ago\``,
                        `Highest Role: ${member.roles.highest}`,
                        `Is Server Owner: \`${msg.guild.ownerID == user.id ? "Yes" : "No"}\``
                    ]
                },
                {
                    name: "Permissions", value: permissions.join(", ")
                },
                {
                    name: "Presence", value: [
                        `Status: \`${user.presence.status === "dnd" ? "Do Not Disturb" : user.presence.status.toProperCase()}\``,
                        `Activities: \`${user.presence.activities.length === 0 ? "None" : user.presence.activities.map(a => `${a.type === "LISTENING" ? "Listening to" : a.type == "CUSTOM_STATUS" ? "Custom Status:" : a.type.toProperCase()} ${a.type === "CUSTOM_STATUS" ? a.state : a.name}`).join(", ")}\``,
                        `Client Status: \`${user.presence.clientStatus ? Object.keys(user.presence.clientStatus).map(c => c.toProperCase()).join(" & ") : "N/A"}\``
                    ]
                }

            ],
            thumbnail: {
                url: user.displayAvatarURL({ dynamic: true })
            },
            color: client.config.colours.main
        }
        await msg.reply({ embed })
    }
}