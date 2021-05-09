import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "captcha",
				description: "Make a captcha with your specified text",
				defaultPermission: true,
				options: [
					{
						name: "text",
						type: "STRING",
						required: true,
						description: "The text to put on the captcha"
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
		let text = encodeURIComponent(msg.options[0].value);
		if (text.length > 500)
			return await msg.editReply(this.client.presets.less_than_500);
		let { data } = await this.client.web.get(
			`https://api.alexflipnote.dev/captcha?text=${text}`,
			{
				responseType: "arraybuffer",
				headers: {
					Authorization: this.client.config.afn
				}
			}
		);
		return await msg.editReply({
			files: [{ name: "captcha.png", attachment: data }]
		});
	}
};
