import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "bird",
				description: "See an image of a bird",
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
		await msg.defer();
		let { data } = await this.client.web.get(
			`https://some-random-api.ml/img/birb`
		);
		await msg.reply({
			files: [
				{
					attachment: data.link,
					name: "bird.gif"
				}
			]
		});
	}
};
