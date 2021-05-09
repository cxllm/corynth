import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";

export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "links",
				description: "View the links the bot uses.",
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
		return await msg.reply({
			embeds: [
				{
					title: "Important Links",
					thumbnail: { url: this.client.user.avatarURL({ format: "png" }) },
					description: Object.keys(this.client.links)
						.map(
							(link) => `[${link.toProperCase()}](${this.client.links[link]})`
						)
						.join(" | "),
					color: this.client.config.colours.main
				}
			]
		});
	}
};
