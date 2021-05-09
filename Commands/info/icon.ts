import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "icon",
				description: "View the server's icon.",
				defaultPermission: true
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
		if (!msg.guild.icon)
			return await msg.reply("This server does not have an icon!");
		const url = msg.guild.iconURL({ dynamic: true, size: 2048, format: "png" });
		const avatar = {
			png: msg.guild.iconURL({ format: "png" }),
			jpg: msg.guild.iconURL({ format: "jpg" }),
			gif: msg.guild.iconURL({ format: "gif" })
		};
		const embed = {
			title: `${msg.guild.name}'s Icon`,
			description: Object.keys(avatar)
				.map((i) => `[${i.toUpperCase()}](${avatar[i]})`)
				.join(" | "),
			image: {
				url
			},
			color: this.client.config.colours.main
		};
		return await msg.reply({ embeds: [embed] });
	}
};
