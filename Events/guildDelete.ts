import Event from "../Structs/Event";
import Client from "../Structs/Client";
import { Guild } from "discord.js-light";

export = class extends Event {
	constructor(client: Client) {
		super(client, "guildDelete", "on");
	}
	async run(guild: Guild) {
		await this.client.db.guilds.delete(guild.id);
		await this.client.webhooks.guilds.send({
			username: `Server Removed`,
			avatarURL: this.client.user.avatarURL(),
			embeds: [
				{
					title: "Server Removed Me",
					description: `Now at ${this.client.guilds.cache.size} guilds`,
					fields: [
						{
							name: "Info",
							value: [
								`Name: \`${guild.name}\``,
								`Members: \`${guild.memberCount}\``,
								`Owner: \`${
									(
										await this.client.users.fetch(guild.ownerId, { cache: false })
									).tag
								}\``,
								`ID: \`${guild.id}\``
							]
						}
					],
					thumbnail: {
						url: guild.iconURL()
					},
					color: this.client.config.colours.success,
					timestamp: Date.now()
				}
			]
		});
	}
};
