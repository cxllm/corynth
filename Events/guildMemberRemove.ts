import Event from "../Structs/Event";
import Client from "../Structs/Client";
import { GuildMember } from "discord.js-light";

export = class extends Event {
	constructor(client: Client) {
		super(client, "guildMemberRemove", "on");
	}
	async run(member: GuildMember) {
		let guilddb = await this.client.db.guilds.get(member.guild.id);
		if (!guilddb) return;
		if (guilddb.leave) {
			if (guilddb.leave && guilddb.leave.channel && guilddb.leave.message) {
				let channel;
				try {
					channel = await member.guild.channels.fetch(guilddb.leave.channel, {
						cache: false
					});
				} catch {
					guilddb.leave = {};
					return await this.client.db.guilds.set(member.guild.id, guilddb);
				}

				channel.send(
					guilddb.leave.message
						.replace("[tag]", member.user.tag)
						.replace("[servername]", member.guild.name)
						.replace("[mention]", member.toString())
						.replace("[members]", member.guild.memberCount)
						.replace("[username]", member.user.username)
				);
			}
		}
	}
};
