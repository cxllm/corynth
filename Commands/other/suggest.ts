import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
import { WebhookClient } from "discord.js-light";

export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "suggest",
				description:
					"Make a suggestion to the server (if suggestions are enabled).",
				defaultPermission: true,
				options: [
					{
						name: "suggestion",
						type: "STRING",
						description: "Your suggestion",
						required: true
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
		await msg.deferReply({ ephemeral: true });
		const { suggestions } = msg.db;
		if (!suggestions || !suggestions.id || !suggestions.token)
			return await msg.editReply(`Suggestions are disabled in this server`);
		let webhook: WebhookClient;
		try {
			webhook = new WebhookClient({
				id: suggestions.id,
				token: suggestions.token
			});
			await webhook.send({
				embeds: [
					{
						title: `Suggestion from ${msg.user.tag}`,
						description: msg.options.getString("suggestion"),
						footer: {
							text: `Provided by ${this.client.user.tag}`,
							iconURL: this.client.user.avatarURL()
						},
						thumbnail: {
							url: msg.user.avatarURL({ dynamic: true })
						},
						color: this.client.config.colours.main
					}
				],
				//@ts-ignore
				username: msg.user.tag,
				avatarURL: msg.user.avatarURL()
			});
		} catch (e) {
			console.log(e);
			msg.db.suggestions = null;
			await this.client.db.guilds.set(msg.guild.id, msg.db);
			return await msg.editReply(`Suggestions are disabled in this server`);
		}
		return await msg.editReply(`Suggestion sent`);
	}
};
