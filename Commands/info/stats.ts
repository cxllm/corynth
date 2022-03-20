import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
import { MessageEmbedOptions, version } from "discord.js-light";
import * as os from "os";

export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "stats",
				description: "View the bot's stats and other information.",
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
		await msg.deferReply();
		const latency = {
			db: {
				live: await this.client.Util.dbLatency(msg.user.id)
			},
			client: Math.round(this.client.ws.ping)
		};
		let embed: MessageEmbedOptions = {
			title: "Bot Information & Stats",
			thumbnail: { url: this.client.user.avatarURL({ format: "png" }) },
			fields: [
				{
					name: "Statistics",
					value: [
						`Servers: ${this.client.guilds.cache.size}`,
						`Users: ${this.client.Util.totalUsers().toLocaleString("fr")}`,
						`Cached Users: ${this.client.users.cache.size}`
					].join("\n")
				},
				{
					name: "Latency",
					value: [
						`Database Response: ${latency.db.live}ms`,
						`Client To Discord: ${latency.client}ms`
					].join("\n")
				},
				{
					name: "Versions",
					value: [
						`Node.js: ${process.version}`,
						`discord.js-light: v${version}`
					].join("\n")
				},
				{
					name: "Bot Stats",
					value: [
						`Memory Usage: ${this.client.Util.memory(
							process.memoryUsage().heapUsed
						)}MB/${Math.round(this.client.Util.memory(os.totalmem(), "gb"))}GB (${
							Math.round((process.memoryUsage().heapUsed / os.totalmem()) * 1000) / 10
						}%)`,
						`Uptime: ${this.client.Util.timestamp(this.client.uptime)}`,
						`Version: v${this.client.getVersion()}`
					].join("\n")
				},
				{
					name: "System Stats",
					value: [
						`Memory: ${this.client.Util.memory(os.totalmem(), "gb")}GB`,
						`OS: ${await this.client.Util.getOS()}`,
						`Uptime: ${this.client.Util.timestamp(os.uptime() * 1000)}`
					].join("\n")
				}
			],
			color: this.client.config.colours.main
		};
		await msg.editReply({ embeds: [embed] });
	}
};
