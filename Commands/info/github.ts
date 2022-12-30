import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";

export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "github",
				defaultPermission: true,
				description: "GitHub info for users or organisations",
				options: [
					{
						name: "user",
						type: "SUB_COMMAND",
						description: "Get a user on GitHub",
						options: [
							{
								name: "username",
								type: "STRING",
								description: "User to get info of",
								required: true
							}
						]
					},
					{
						name: "organisation",
						type: "SUB_COMMAND",
						description: "Get an organisation on GitHub",
						options: [
							{
								name: "organisation",
								type: "STRING",
								description: "Organisation to get info of",
								required: true
							}
						]
					}
				]
			},
			{
				owner: false,
				permissions: {},
				slash: true,
				cooldown: "15s"
			}
		);
		this.client = client;
	}

	async run(msg: CommandInteraction) {
		let opt = msg.options.getSubcommand();
		if (opt == "user") {
			await msg.deferReply();
			try {
				const { data } = await this.client.web.get(
					`https://api.github.com/users/${msg.options.getString("username")}`
				);
				let embed = {
					title: `User Info - ${data.login}`,
					url: data.html_url,
					thumbnail: {
						url: data.avatar_url
					},
					description: [
						`Username: \`${data.login}\``,
						`Name: \`${data.name}\``,
						`Email: \`${data.email || "No Email Given"}\``,
						`Bio: \`${data.bio || "No Bio"}\``,
						`Public Repos: \`${data.public_repos}\``,
						`Followers: \`${data.followers}\``,
						`Following: \`${data.following}\``,
						`Twitter: ${
							data.twitter_username
								? `https://twitter.com/${data.twitter_username}`
								: "No Twitter"
						}`,
						`Created At: \`${this.client.Util.utcDate(data.created_at)}\``
					].join("\n"),
					color: this.client.config.colours.main,
					footer: {
						text: this.client.presets.utc
					}
				};
				await msg.editReply({ embeds: [embed] });
			} catch {
				await msg.editReply(`Specified user was not found`);
			}
		} else if (opt == "organisation") {
			await msg.deferReply();
			try {
				const { data } = await this.client.web.get(
					`https://api.github.com/orgs/${msg.options.getString("organisation")}`
				);
				let embed = {
					title: `Organisation Info - ${data.login}`,
					url: data.html_url,
					thumbnail: {
						url: data.avatar_url
					},
					description: [
						`Username: \`${data.login}\``,
						`Name: \`${data.name}\``,
						`Email: \`${data.email || "No Email Given"}\``,
						`Description: \`${data.description || "No Description"}\``,
						`Public Repos: \`${data.public_repos}\``,
						`Followers: \`${data.followers}\``,
						`Following: \`${data.following}\``,
						`Twitter: ${
							data.twitter_username
								? `https://twitter.com/${data.twitter_username}`
								: "No Twitter"
						}`,
						`Created At: \`${this.client.Util.utcDate(data.created_at)}\``
					].join("\n"),
					color: this.client.config.colours.main,
					footer: {
						text: this.client.presets.utc
					}
				};
				await msg.editReply({ embeds: [embed] });
			} catch {
				await msg.editReply(`Specified organisation was not found`);
			}
		}
	}
};
