import Event from "../Structs/Event";
import Client from "../Structs/Client";
import { GuildMember } from "discord.js";

export = class extends Event {

    constructor(client: Client) {
        super(client, "guildMemberAdd", "on");
    }
    async run(member: GuildMember) {
        let guilddb = await this.client.db.guilds.get(member.guild.id);
        if (!guilddb) return;
        if (guilddb.autorole) {
            if (!member.guild.me.permissions.has("MANAGE_ROLES")) { }
            else {
                if (member.user.bot && guilddb.autorole.bot) {
                    if (!member.guild.roles.cache.has(guilddb.autorole.bot)) {
                        guilddb.autorole.bot = null;
                        return await this.client.db.guilds.set(member.guild.id, guilddb)
                    }
                    member.roles.add(guilddb.autorole.bot);
                } else if (guilddb.autorole.user) {
                    if (!member.guild.roles.cache.has(guilddb.autorole.user)) {
                        guilddb.autorole.user = null;
                        return await this.client.db.guilds.set(member.guild.id, guilddb)
                    }
                    member.roles.add(guilddb.autorole.user);
                }
            }
        }
        if (guilddb.join) {
            if (guilddb.join && guilddb.join.channel && guilddb.join.message) {
                let channel;
                try {
                    channel = await member.guild.channels.fetch(guilddb.join.channel, false)
                } catch {
                    guilddb.join = {};
                    return await this.client.db.guilds.set(member.guild.id, guilddb)

                }
                let joined = `${member.guild.memberCount}`
                if (joined.endsWith("1") && !joined.endsWith("11")) joined += "st"
                else if (joined.endsWith("2") && !joined.endsWith("12")) joined += "nd"
                else if (joined.endsWith("3") && !joined.endsWith("13")) joined += "rd"
                else joined += "th"
                channel.send(guilddb.join.message
                    .replace("[tag]", member.user.tag)
                    .replace("[servername]", member.guild.name)
                    .replace("[mention]", member.toString())
                    .replace("[members]", member.guild.memberCount)
                    .replace("[username]", member.user.username)
                    .replace("[place]", joined)
                )
            }
        }
    }
}