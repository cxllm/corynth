import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { exec } from "child_process";

export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				description: "Refresh the bot's modules.",
				name: "refresh"
			},
			{
				owner: true,
				args: 0,
				permissions: {},
				slash: false,
				aliases: ["reload"],
				usage: ""
			}
		);
		this.client = client;
	}

	async run(msg: Message) {
		await msg.send("Currently refreshing modules. Please wait...");
		delete require.cache[require.resolve("../../Structs/Util")];
		this.client.Util = new (require("../../Structs/Util").default)(this.client);
		delete require.cache[require.resolve("../../config")];
		this.client.config = require("../../config").default;
		delete require.cache[require.resolve("../../presets")];
		this.client.presets = require("../../presets");
		this.client.handleCommands();
		this.client.handleEvents();
		await msg.send("Modules refreshed.");
	}
};
