import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "coin",
				description: "Flip a coin",
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
		const coin = !!Math.round(Math.random()) ? "Heads" : "Tails";
		return await msg.reply(`🪙 Coin Flip Outcome: \`${coin}\``);
	}
};
