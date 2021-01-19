
const Event = require("../Structs/Event")
const Client = require("../Structs/Client")
const { GuildMember } = require("discord.js-light")
module.exports = class extends Event {
    constructor() {
        super("guildMemberRemove", {
            method: "on"
        })
    }
    /**
     * 
     * @param {Client} client
     * @param {GuildMember} member
     */
    async run(client, member) {
        let guilddb = await client.db.Guilds.get(member.guild.id);
        if (!guilddb) {
            guilddb = {
                prefix: client.config.prefix
            }
            client.db.Guilds.set(member.guild.id, guilddb)
        }
        if (guilddb.leave) {
            let channel;
            try {
                channel = await member.guild.channels.fetch(guilddb.leave.channel);
            } catch {
                guilddb.leave = {};
                return await client.db.Guilds.set(member.guild.id, guilddb);
            }
            channel.send(guilddb.leave.message
                .replace("[tag]", member.user.tag)
                .replace("[servername]", member.guild.name)
                .replace("[mention]", member.toString())
                .replace("[members]", member.guild.memberCount)
                .replace("[username]", member.user.username)
            )
        }
    }
}