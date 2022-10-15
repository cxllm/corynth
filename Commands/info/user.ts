import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
import perms from "../../permissions";
import { GuildMember, User } from "discord.js";
export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "user",
				description: "View a user's information.",
				defaultPermission: true,
				options: [
					{
						name: "user",
						type: "USER",
						description: "User to get info of",
						required: false
					}
				]
			},
			{
				owner: false,
				permissions: {},
				slash: true,
				guild: true
			}
		);
		this.client = client;
	}

	async run(msg: CommandInteraction) {
		let user: User = msg.options.getUser("user", false) || msg.user;
		//@ts-ignore
		let member: GuildMember =
			user.id == msg.user.id
				? msg.member
				: msg.guild.members.cache.get(user.id) ||
				  (await msg.guild.members.fetch({ user: user.id, cache: false }));
		console.log(member.presence);
		const avatar = user.displayAvatarURL({ dynamic: true, format: "png" });
		const permissions =
			member.permissions
				.toArray()
				.map((perm) => `\`${perms[perm]}\``)
				.join(", ") || "No Permissions";
		const embed = {
			author: {
				name: user.tag,
				icon_url: avatar
			},
			thumbnail: {
				url: avatar
			},
			title: "User Info",
			fields: [
				{
					name: "Info",
					value: [
						`Username: \`${user.username}\``,
						`Discriminator: \`${user.discriminator}\``,
						`Tag: \`${user.tag}\``,
						`ID: \`${user.id}\``,
						`Bot: \`${user.bot ? "Yes" : "No"}\``,
						`Created At: \`${this.client.Util.utcDateShort(
							user.createdTimestamp
						)} (${this.client.Util.durationAgo(
							Date.now() - user.createdTimestamp
						)})\``,
						`[Avatar URL](${avatar}) | [Default Avatar URL](${user.defaultAvatarURL})`
					].join("\n")
				},
				{
					name: "Server Specific Info",
					value: [
						`Nickname: \`${member.nickname ?? user.username}\``,
						`Joined At: \`${this.client.Util.utcDateShort(
							member.joinedTimestamp
						)} (${this.client.Util.durationAgo(
							Date.now() - member.joinedTimestamp
						)})\``,
						`Highest Role: ${member.roles.highest}`,
						`Owns Server: \`${msg.guild.ownerId == user.id ? "Yes" : "No"}\``
					].join("\n")
				},
				{
					name: "Permissions",
					value: permissions
				},
				{
					name: "Presence",
					value: member.presence
						? [
								`Status: \`${
									member.presence.status === "dnd"
										? "Do Not Disturb"
										: member.presence.status.toProperCase()
								}\``,
								`Activities: \`${
									member.presence.activities.length === 0
										? "None"
										: member.presence.activities
												.map(
													(a) =>
														`${
															a.type === "LISTENING"
																? "Listening to"
																: a.type == "CUSTOM"
																? "Custom Status:"
																: a.type.toProperCase()
														} ${a.type === "CUSTOM" ? a.state : a.name}`
												)
												.join(", ")
								}\``,
								`Client Status: \`${
									member.presence.clientStatus
										? Object.keys(member.presence.clientStatus)
												.map((c) => c.toProperCase())
												.join(" & ") || "N/A"
										: "N/A"
								}\``
						  ].join("\n")
						: "Status: `Offline`"
				}
			],
			color: this.client.config.colours.main,
			footer: {
				text: this.client.presets.utc
			}
		};
		await msg.reply({ embeds: [embed] });
	}
};
