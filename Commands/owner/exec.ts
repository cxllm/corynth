import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { exec } from "child_process";

export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "exec",
				description: "Execute a command."
			},
			{
				owner: true,
				slash: false,
				args: 1,
				aliases: ["execute", "sh", "shell"],
				usage: "<command>",
				permissions: {}
			}
		);
		this.client = client;
	}

	async run(msg: Message) {
		exec(msg.args.join(" "), async (_, out, stderr) => {
			return await msg.channel.send(
				`\`\`\`${(out || stderr).substr(0, 1994) || "No output"}\`\`\``
			);
		});
	}
};
