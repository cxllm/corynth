import axios from "axios";
import { MessageAttachment } from "discord.js-light";
import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "youtube-comment",
				description: "Make a fake youtube comment",
				defaultPermission: true,
				options: [
					{
						name: "comment",
						description: "The content of the comment",
						required: true,
						type: "STRING"
					},
					{
						name: "user",
						description: "The user to have the comment from",
						required: false,
						type: "USER"
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
		const user = msg.options.getUser("user") || msg.user;
		const url = user.displayAvatarURL({
			dynamic: true,
			size: 2048,
			format: "png"
		});
		const content = msg.options.getString("comment");
		const { data } = await axios.get(
			`https://some-random-api.ml/canvas/misc/youtube-comment?avatar=${encodeURIComponent(
				url
			)}&comment=${encodeURIComponent(content)}&username=${encodeURIComponent(
				user.username
			)}`,
			{
				responseType: "arraybuffer"
			}
		);
		return await msg.reply({
			files: [
				{
					attachment: data,
					name: "youtube.png"
				}
			]
		});
	}
};
