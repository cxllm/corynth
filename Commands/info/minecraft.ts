import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";

export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "minecraft",
				defaultPermission: true,
				description: "Get info for a minecraft player or server",
				options: [
					{
						name: "user",
						type: "SUB_COMMAND",
						description: "Get info for a minecraft player",
						options: [
							{
								name: "username",
								required: true,
								description: "The username of the user you would like to get",
								type: "STRING"
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
			let username = msg.options.get("username").value;
			const {
				data: { id }
			} = await this.client.web.get(`https://api.minetools.eu/uuid/${username}`);
			if (!id) return msg.editReply(`Specified user was not found`);
			let { data } = await this.client.web.get(
				`https://api.minetools.eu/profile/${id}`
			);
			data = data.decoded;
			let embed = {
				title: `Minecraft User Info - ${data.profileName}`,
				description: [
					`Username: \`${data.profileName}\``,
					`UUID: \`${id}\``,
					`Skin: [Click Here](${data.textures.SKIN.url})`
				].join("\n"),
				image: {
					url: data.textures.SKIN.url
				},
				color: this.client.config.colours.main
			};
			await msg.editReply({ embeds: [embed] });
		}
	}
};
