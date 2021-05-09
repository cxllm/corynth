const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light")
module.exports = class extends Command {
    constructor() {
        super("server", {
            help: {
                aliases: ["si", "serverinfo", "guild"],
                usage: "",
                description: "View server info"
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
        const guild = msg.guild;
        const guildFeatures = guild.features.map(feat => {
            return client.guildInfo.guildFeatures[feat].replace("{code}", guild.vanityURLCode)
        }).join(", ") || "No Features"
        const icon = guild.iconURL({ dynamic: true, format: "png" });
        const embed = {
            author: {
                name: guild.name,
                icon_url: icon
            },
            title: `Server Info`,
            fields: [
                {
                    name: "Basic Info",
                    value: [
                        `Name: \`${guild.name}\``,
                        `ID: \`${guild.id}\``,
                        `Region: \`${client.guildInfo.guildRegions[guild.region]}\``,
                        `Members: \`${guild.memberCount}\``,
                        `Channels: \`${(await guild.channels.fetch()).size}\``,
                        `Roles: \`${guild.roles.cache.filter(role => role.id !== guild.id).size}\``,
                        `Owner: \`${(await guild.members.fetch(guild.ownerID, false)).user.tag}\``,
                        `[Icon URL](${icon})`
                    ].join("\n")
                },
                {
                    name: "Features",
                    value: guildFeatures
                },
                {
                    name: "More Info",
                    value: [
                        `Created At (UTC): \`${client.Util.utcDate(guild.createdTimestamp)}, ${client.Util.durationAgo(Date.now() - guild.createdTimestamp)} ago\``,
                        `${client.user.username} Joined At (UTC): \`${client.Util.utcDate(guild.joinedTimestamp)}, ${client.Util.durationAgo(Date.now() - guild.joinedTimestamp)} ago\``,
                        `Verification Level: \`${client.guildInfo.verificationLevels[guild.verificationLevel]}\``,
                        `Total Boosts: \`${guild.premiumSubscriptionCount}\``,
                        `Boost Level: \`${guild.premiumTier}\``,
                        `AFK Channel: \`${guild.afkChannel?.name ?? "No AFK Channel"}\``,
                        `Highest Role: ${guild.roles.cache.find(r => r.position === guild.roles.cache.size - 1)}`
                    ].join("\n")
                }
            ],
            color: client.config.colours.main
        };
        await msg.reply({ embed });
    }

}