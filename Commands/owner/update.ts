import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { exec } from "child_process";

export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				description: "Update Slash Commands.",
				name: "update"
			},
			{
				owner: true,
				args: 0,
				permissions: {},
				slash: false,
				aliases: ["slash-commands"],
				usage: ""
			}
		);
		this.client = client;
	}

	async run(msg: Message) {
		await msg.channel.send("Currently refreshing slash commands. Please wait...");
		await this.client.Util.updateSlashCommands();
		await msg.channel.send("Refreshed slash commands");
	}
};
