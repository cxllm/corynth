import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "fml",
				description: "An FML story",
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
		const {
			data: { text }
		} = await this.client.web.get("https://api.alexflipnote.dev/fml", {
			headers: {
				Authorization: this.client.config.afn
			}
		});
		await msg.editReply({
			embeds: [
				{
					title: `FML Story`,
					color: this.client.config.colours.main,
					description: text
				}
			]
		});
	}
};
