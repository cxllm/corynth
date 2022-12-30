import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";

export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "prefix",
				description:
					"Configure the prefix for your server, does not apply to slash commands."
			},
			{
				owner: false,
				args: 1,
				slash: false,
				permissions: {
					user: "MANAGE_GUILD"
				},
				usage: "<new prefix|clear>",
				aliases: []
			}
		);
		this.client = client;
	}

	async run(msg: Message) {
		if (msg.args[0].toLowerCase() == "clear") {
			msg.db.prefix = this.client.config.prefix;
			await msg.channel.send({
				embeds: [
					{
						title: "Prefix Reset",
						description: ` Server prefix was reset to ${msg.db.prefix}`,
						color: this.client.config.colours.success
					}
				]
			});
		} else {
			msg.db.prefix = msg.args[0];
			await msg.channel.send({
				embeds: [
					{
						title: "Prefix Set",
						description: `Server prefix was set to ${msg.db.prefix}`,
						color: this.client.config.colours.success
					}
				]
			});
		}
		return await this.client.db.guilds.set(msg.guild.id, msg.db);
	}
};
