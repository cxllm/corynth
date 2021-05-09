import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "encode",
				description: "Encode some text to an encoding method",
				defaultPermission: true,
				options: [
					{
						name: "method",
						description: "The encoding method to use",
						type: "STRING",
						required: true,
						choices: [
							{
								name: "Base 64",
								value: "base64"
							},
							{
								name: "Binary",
								value: "binary"
							}
						]
					},
					{
						name: "text",
						description: "The text to encode",
						type: "STRING",
						required: true
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
		await msg.defer();
		let type = msg.options[0].value.toString(),
			text = msg.options[1].value.toString();
		const encoded = this.client.Util.encode(type, text);
		let embed = {
			title: `Encoded Text into ${type.toProperCase()}`,
			description: encoded,
			color: this.client.config.colours.main
		};
		await msg.editReply({ embeds: [embed] });
	}
};
