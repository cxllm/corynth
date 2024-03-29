import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "animal",
				description: "See an image of the specified animal",
				defaultPermission: true,
				options: [
					{
						name: "animal",
						description: "The animal to see an image of",
						required: true,
						type: "STRING",
						choices: [
							{ name: "Bird", value: "bird" },
							{ name: "Dog", value: "dog" },
							{ name: "Cat", value: "cat" },
							{ name: "Koala", value: "koala" },
							{ name: "Panda", value: "panda" },
							{ name: "Fox", value: "fox" },
							{
								name: "Kangaroo",
								value: "kangaroo"
							},
							{ name: "Koala", value: "koala" }
						]
					}
				]
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
		let { data } = await this.client.web.get(
			`https://some-random-api.ml/img/${msg.options.getString("animal")}`
		);
		await msg.editReply({
			files: [
				{
					attachment: data.link,
					name: "animal.png"
				}
			]
		});
	}
};
