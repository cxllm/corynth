import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";

export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "youtube-together",
				description:
					"Start a YouTube Together session in a voice channel (Note: This may not work in every server). ",
				defaultPermission: true,
				options: [
					{
						name: "channel",
						type: "CHANNEL",
						description: "The voice channel to start the activity in",
						required: true
					}
				]
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
		await msg.deferReply();
		let channel = msg.options.getChannel("channel");
		if (channel.type != "GUILD_VOICE")
			return msg.editReply("YouTube Together only works in voice channels!");
		try {
			let { data } = await this.client.web.post(
				`https://discord.com/api/v${this.client.options.http.version}/channels/${channel.id}/invites`,
				{
					max_age: 86400,
					max_uses: 0,
					target_application_id: "755600276941176913",
					target_type: 2,
					temporary: false,
					validate: null
				},
				{
					headers: {
						Authorization: `Bot ${this.client.token}`,
						"Content-Type": "application/json"
					}
				}
			);
			if (!data.code) throw "No invite code";
			return await msg.editReply(
				`YouTube Together activity has been created in <#${channel.id}>. To start it, [click here](https://discord.gg/${data.code}) (Note: This may not work in every server).`
			);
		} catch {
			return await msg.editReply(
				"There was an error starting the YouTube Together activity"
			);
		}
	}
};
