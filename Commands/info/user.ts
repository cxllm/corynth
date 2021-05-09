import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
import perms from "../../permissions";
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
		let user = msg.options[0]?.user || msg.user;
		let member =
			user.id == msg.user.id
				? msg.member
				: msg.guild.members.cache.get(user.id) ||
				  (await msg.guild.members.fetch(user.id, { cache: false }));
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
					]
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
						`Status: \`${
							user.presence.status === "dnd"
								? "Do Not Disturb"
								: user.presence.status.toProperCase()
						}\``,
						`Activities: \`${
							user.presence.activities.length === 0
								? "None"
								: user.presence.activities
										.map(
											(a) =>
												`${
													a.type === "LISTENING"
														? "Listening to"
														: a.type == "CUSTOM_STATUS"
														? "Custom Status:"
														: a.type.toProperCase()
												} ${a.type === "CUSTOM_STATUS" ? a.state : a.name}`
										)
										.join(", ")
						}\``,
						`Client Status: \`${
							user.presence.clientStatus
								? Object.keys(user.presence.clientStatus)
										.map((c) => c.toProperCase())
										.join(" & ") || "N/A"
								: "N/A"
						}\``
					]
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
