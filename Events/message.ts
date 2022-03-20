import Event from "../Structs/Event";
import Client from "../Structs/Client";
import Message from "../Structs/Message";
import ms from "ms";
import permissions from "../permissions";

export = class extends Event {
	constructor(client: Client) {
		super(client, "messageCreate", "on");
	}

	async run(msg: Message) {
		if (msg.author.bot) return;
		if (msg.channel.type == "DM") return;
		let guild = await this.client.db.guilds.get(msg.guild.id);
		if (!guild) {
			guild = {
				prefix: this.client.config.prefix
			};
			this.client.db.guilds.set(msg.guild.id, guild);
		}
		msg.db = guild;
		let prefix = guild.prefix;
		const mentionRegex = new RegExp(`^(<@!?${this.client.user.id}>)`);
		if (mentionRegex.test(msg.content.toLowerCase())) {
			const [, mention] = msg.content.match(mentionRegex);
			if (msg.content.startsWith(mention)) {
				prefix = mention;
			}
		}
		if (msg.content == prefix && prefix.includes(this.client.user.id))
			return await msg.channel.send({
				embeds: [
					{
						description: `Corynth is now primarily slash command based. If you are running \`/\` and you are unable to see Corynth's commands, please run \`${
							guild.prefix
						}help\` or ${this.client.user.toString()}.`,
						color: this.client.config.colours.main
					}
				]
			});
		if (!msg.content.toLowerCase().startsWith(prefix.toLowerCase())) return;
		msg.args = msg.content.slice(prefix.length).trim().split(" ");
		let cmd = msg.args.shift().toLowerCase();
		let command = this.client.getCommand(cmd);
		if (!command) {
			if (this.client.slashes.has(cmd))
				return await msg.channel.send(
					`This command is a slash command and can't be used in a normal context. If you would like to use it, please run \`/${cmd}\`. If you can't see Corynth's slash commands listed, please run \`${msg.db.prefix}help\``
				);
			return;
		}
		if (command.config.owner && !this.client.owner(msg.author.id)) return;
		if (command.config.args > msg.args.length)
			return await msg.channel.send(this.client.UsageEmbed(command));
		if (
			command.config.permissions.user &&
			!msg.member.permissions.has(command.config.permissions.user) &&
			!this.client.owner(msg.author.id)
		)
			return await msg.channel.send({
				embeds: [
					{
						description: `${
							this.client.config.emojis.cross
						} You don't have the required permission to run \`${
							command.name
						}\`, you need the \`${
							permissions[command.config.permissions.user]
						}\` permission.`,
						color: this.client.config.colours.error
					}
				]
			});
		if (
			command.config.permissions.bot &&
			!msg.guild.me.permissions.has(command.config.permissions.bot)
		)
			return await msg.channel.send({
				embeds: [
					{
						description: `${
							this.client.config.emojis.cross
						} I don't have the required permission to run \`${
							command.name
						}\`, I need the \`${
							permissions[command.config.permissions.bot]
						}\` permission.`,
						color: this.client.config.colours.error
					}
				]
			});
		if (command.config.cooldown && !this.client.owner(msg.author.id)) {
			let user = await this.client.db.users.get(msg.author.id);
			if (!user)
				user = {
					id: msg.author.id,
					cooldown: []
				};
			const cooldown = user.cooldown.filter((c) => c.name == command.name)[0];
			if (cooldown) {
				if (Date.now() > cooldown.end) {
					user.cooldown.splice(user.cooldown.indexOf(cooldown), 1);
				} else
					return msg.channel.send(
						`The command ${command.name} has a ${
							command.config.cooldown
						} cooldown. Please wait ${this.client.Util.duration(
							cooldown.end - Date.now()
						)} before using the command again.`
					);
			}
			user.cooldown.push({
				name: command.name,
				end: Date.now() + ms(command.config.cooldown)
			});
			await this.client.db.users.set(msg.author.id, user);
		}
		try {
			await command.run(msg);
		} catch (e) {
			console.log(e);
			await msg.channel.send({
				embeds: [
					{
						title: "Sorry, an error occured",
						description: `An error occured while running the ${command.name} command.\nThis has been reported to the developer`,
						color: this.client.config.colours.error,
						fields: [
							{
								name: "Details",
								value: "```js\n" + e + "```"
							}
						]
					}
				]
			});
			let err = {
				title: "An Error Occured",
				description: `An error occured while running the ${command.name} command.`,
				fields: [
					{
						name: "Details",
						value: [`User: ${msg.author.tag}`, `Content: ${msg.content}`]
					},
					{
						name: "Error",
						value: "```js\n" + e + "```"
					}
				],
				color: this.client.config.colours.error
			};
			await this.client.webhooks.errors.send({
				username: `Error`,
				avatarURL: this.client.user.avatarURL(),
				embeds: [err]
			});
		}
	}
};
