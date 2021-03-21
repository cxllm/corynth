"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("user", {
            description: "View information about a user.",
            aliases: ["userinfo", "user-info", "ui"],
            usage: "[user]"
        }, {
            owner: false,
            args: 0,
            permissions: {},
            cooldown: "5s"
        });
        this.client = client;
    }
    async run(msg) {
        var _a;
        await msg.send(`${this.client.config.emojis.loading} Loading Info...`);
        const member = await this.client.Util.getMember(msg);
        const user = member.user;
        const avatar = user.displayAvatarURL({ dynamic: true, format: "png" });
        const permissions = member.permissions.toArray().map(perm => `\`${this.client.permissions[perm]}\``).join(", ") || "No Permissions";
        const embed = {
            author: {
                name: user.tag,
                icon_url: avatar
            },
            thumbnail: {
                url: avatar
            },
            title: `User Info`,
            fields: [
                {
                    name: "Info",
                    value: [
                        `Username: \`${user.username}\``,
                        `Discriminator: \`${user.discriminator}\``,
                        `Tag: \`${user.tag}\``,
                        `ID: \`${user.id}\``,
                        `Bot: \`${user.bot ? "Yes" : "No"}\``,
                        `Created At: \`${this.client.Util.utcDateShort(user.createdTimestamp)} (${this.client.Util.durationAgo(Date.now() - user.createdTimestamp)})\``,
                        `[Avatar URL](${avatar}) | [Default Avatar URL](${user.defaultAvatarURL})`,
                    ]
                },
                {
                    name: "Server Specific Info",
                    value: [
                        `Nickname: \`${(_a = member.nickname) !== null && _a !== void 0 ? _a : user.username}\``,
                        `Joined At: \`${this.client.Util.utcDateShort(member.joinedTimestamp)} (${this.client.Util.durationAgo(Date.now() - member.joinedTimestamp)})\``,
                        `Highest Role: ${member.roles.highest}`,
                        `Owns Server: \`${msg.guild.ownerID == user.id ? "Yes" : "No"}\``
                    ]
                },
                {
                    name: "Permissions",
                    value: permissions
                },
                {
                    name: "Presence",
                    value: [
                        `Status: \`${user.presence.status === "dnd" ? "Do Not Disturb" : user.presence.status.toProperCase()}\``,
                        `Activities: \`${user.presence.activities.length === 0 ? "None" : user.presence.activities.map(a => `${a.type === "LISTENING" ? "Listening to" : a.type == "CUSTOM_STATUS" ? "Custom Status:" : a.type.toProperCase()} ${a.type === "CUSTOM_STATUS" ? a.state : a.name}`).join(", ")}\``,
                        `Client Status: \`${user.presence.clientStatus ? Object.keys(user.presence.clientStatus).map(c => c.toProperCase()).join(" & ") : "N/A"}\``
                    ]
                }
            ],
            color: this.client.config.colours.main,
            footer: {
                text: this.client.presets.utc
            }
        };
        await msg.send("", { embed });
    }
};
