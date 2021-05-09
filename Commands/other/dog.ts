import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "dog",
				description: "See an image of a dog",
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
			`https://some-random-api.ml/img/dog`
		);
		await msg.reply({
			files: [
				{
					attachment: data.link,
					name: "dog.gif"
				}
			]
		});
	}
};
