import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "meme",
				description: "Get a random meme from reddit",
				defaultPermission: true
			},
			{
				owner: false,
				permissions: {},
				slash: true
			}
		);
		this.client = client;
	}

	async run(msg: CommandInteraction) {
		await msg.deferReply();
		const { data } = await this.client.web.get(
			"https://api.ksoft.si/images/random-meme",
			{
				headers: {
					Authorization: `Bearer ${this.client.config.ksoft}`
				}
			}
		);
		await msg.editReply({
			embeds: [
				{
					title: data.title,
					image: {
						url: data.image_url
					},
					url: data.source,
					color: this.client.config.colours.main,
					description: `Subreddit: \`${data.subreddit}\`\n${data.upvotes} 👍 | ${data.downvotes} 👎\nAuthor: \`${data.author}\``,
					footer: {
						text: `Powered by ksoft.si`
					}
				}
			]
		});
	}
};
