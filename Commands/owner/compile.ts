import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { exec } from "child_process";

export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "compile",
				description: "Compile the code into javascript."
			},
			{
				owner: true,
				args: 0,
				slash: false,
				permissions: {}
			}
		);
		this.client = client;
	}

	async run(msg: Message) {
		await msg.send("Compiling...");
		exec("tsc", async (_, __, ___) => {
			return await msg.send(`Compiled into JavaScript.`);
		});
	}
};
