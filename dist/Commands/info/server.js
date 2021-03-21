"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
const guildInfo_1 = __importDefault(require("../../guildInfo"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("server", {
            description: "View information about the server.",
            aliases: ["serverinfo", "server-info", "si"],
            usage: ""
        }, {
            owner: false,
            args: 0,
            permissions: {}
        });
        this.client = client;
    }
    async run(msg) {
        var _a, _b;
        const guild = msg.guild;
        const guildInfo = guild.features.map(feat => {
            return guildInfo_1.default.guildFeatures[feat].replace("{code}", guild.vanityURLCode);
        }).join(", ") || "No Features";
        const icon = guild.iconURL({ dynamic: true, format: "png" });
        const embed = {
            author: {
                name: guild.name,
                icon_url: icon
            },
            title: "Server Info",
            thumbnail: {
                url: icon
            },
            fields: [
                {
                    name: "Info",
                    value: [
                        `Name: \`${guild.name}\``,
                        `ID: \`${guild.id}\``,
                        `Region: \`${guildInfo_1.default.guildRegions[guild.region]}\``,
                        `Members: \`${guild.memberCount}\``,
                        `Channels:\`${(await guild.channels.fetch({ cache: false })).size}\``,
                        `Roles: \`${guild.roles.cache.size}\``,
                        `Owner: \`${(await guild.members.fetch(guild.ownerID)).user.tag}\``,
                        `[Icon URL](${icon})`
                    ].join("\n")
                },
                {
                    name: "Features",
                    value: guildInfo
                },
                {
                    name: "In-Depth",
                    value: [
                        `Created At: \`${this.client.Util.utcDate(guild.createdTimestamp)} (${this.client.Util.durationAgo(Date.now() - guild.createdTimestamp)})\``,
                        `I Joined At: \`${this.client.Util.utcDate(guild.joinedTimestamp)} (${this.client.Util.durationAgo(Date.now() - guild.joinedTimestamp)})\``,
                        `Verification Level: \`${guildInfo_1.default.verificationLevels[guild.verificationLevel]}\``,
                        `Boosts: \`${guild.premiumSubscriptionCount}\``,
                        `AFK Channel: \`${(_b = (_a = guild.afkChannel) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "No AFK Channel"}\``,
                        `Highest Role: ${guild.roles.cache.find(r => r.position === guild.roles.cache.size - 1)}`
                    ]
                }
            ],
            color: this.client.config.colours.main,
            footer: {
                text: this.client.presets.utc
            }
        };
        return await msg.send({ embed });
    }
};
