"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Event_1 = __importDefault(require("../Structs/Event"));
module.exports = class extends Event_1.default {
    constructor(client) {
        super(client, "guildMemberRemove", "on");
    }
    async run(member) {
        let guilddb = await this.client.db.guilds.get(member.guild.id);
        if (!guilddb) {
            guilddb = {
                prefix: this.client.config.prefix
            };
            return await this.client.db.guilds.set(member.guild.id, guilddb);
        }
        if (guilddb.leave) {
            if (guilddb.leave && guilddb.leave.channel && guilddb.leave.message) {
                let channel;
                try {
                    channel = await member.guild.channels.fetch(guilddb.leave.channel, false);
                }
                catch {
                    guilddb.leave = {};
                    return await this.client.db.guilds.set(member.guild.id, guilddb);
                }
                channel.send(guilddb.leave.message
                    .replace("[tag]", member.user.tag)
                    .replace("[servername]", member.guild.name)
                    .replace("[mention]", member.toString())
                    .replace("[members]", member.guild.memberCount)
                    .replace("[username]", member.user.username));
            }
        }
    }
};
