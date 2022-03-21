import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
import { TextChannel } from "discord.js-light";

export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "config",
				description: "Edit the bot's config.",
				defaultPermission: true,
				options: [
					{
						name: "edit",
						description:
							"Edit a specific config (for info on config types, run /config info <TYPE>",
						type: "SUB_COMMAND_GROUP",
						options: [
							{
								name: "prefix",
								description: "Change/set the prefix for normal commands",
								type: "SUB_COMMAND",
								options: [
									{
										name: "prefix",
										description: "The new prefix to use",
										required: true,
										type: "STRING"
									}
								]
							},
							{
								name: "suggestions",
								description: "Change/set the suggestions channel",
								type: "SUB_COMMAND",
								options: [
									{
										name: "enable",
										type: "BOOLEAN",
										required: true,
										description: "Whether or not to enable this module"
									},
									{
										name: "channel",
										type: "CHANNEL",
										required: false,
										description: "The channel to use for suggestions"
									}
								]
							},
							{
								name: "welcome",
								description:
									"Set the welcome message and channel (for info type /config info welcome message",
								type: "SUB_COMMAND",
								options: [
									{
										name: "enable",
										type: "BOOLEAN",
										required: true,
										description: "Whether or not to enable this module"
									},
									{
										name: "channel",
										type: "CHANNEL",
										required: false,
										description: "The channel to use for the welcome message"
									},
									{
										name: "message",
										type: "STRING",
										required: false,
										description: "The welcome message"
									}
								]
							},
							{
								name: "goodbye",
								description:
									"Set the goodbye message and channel (for info type /config info goodbye message",
								type: "SUB_COMMAND",
								options: [
									{
										name: "enable",
										type: "BOOLEAN",
										required: true,
										description: "Whether or not to enable this module"
									},
									{
										name: "channel",
										type: "CHANNEL",
										required: false,
										description: "The channel to use for the goodbye message"
									},
									{
										name: "message",
										type: "STRING",
										required: false,
										description: "The goodbye message"
									}
								]
							},
							{
								name: "autorole",
								description: "Set the role to add to users/bots on join",
								type: "SUB_COMMAND",
								options: [
									{
										name: "enable",
										type: "BOOLEAN",
										required: true,
										description: "Whether or not to enable this module"
									},
									{
										name: "type",
										description: "Set an autorole for any bots that join the server",
										type: "STRING",
										required: true,
										choices: [
											{
												name: "Bot",
												value: "bot"
											},
											{
												name: "User",
												value: "user"
											}
										]
									},
									{
										name: "role",
										type: "ROLE",
										description: "The role to give the bot/user",
										required: false
									}
								]
							}
						]
					},
					{
						name: "info",
						description: "See info on a specific config type",
						type: "SUB_COMMAND",
						options: [
							{
								name: "module",
								type: "STRING",
								description: "The config type to view info of",
								required: true,
								choices: [
									{
										name: "Welcome Message",
										value: "welcome"
									},
									{
										name: "Goodbye Message",
										value: "goodbye"
									},
									{
										name: "Suggestions",
										value: "suggestions"
									},
									{
										name: "Auto Roles",
										value: "autoroles"
									}
								]
							}
						]
					},
					{
						name: "view",
						description: "View the server's configuration",
						type: "SUB_COMMAND"
					}
				]
			},
			{
				owner: false,
				slash: true,
				guild: true,
				permissions: {
					user: "MANAGE_GUILD"
				}
			}
		);
		this.client = client;
	}

	async run(msg: CommandInteraction) {
		let opt = msg.options.getSubcommand();
		let group = msg.options.getSubcommandGroup(false);
		if (opt == "info") {
			console.log(msg.options.getString("module"));
			switch (msg.options.getString("module")) {
				case "welcome":
					return await msg.reply({
						embeds: [
							{
								title: "Welcome Message Info",
								description:
									"Welcome messages are sent in a specific channel to welcome a member to your server. You can customise the message using these variables:\n" +
									`[tag] - For the user tag (e.g. ${msg.user.tag})
                [servername] - For the server name (e.g. ${msg.guild.name})
                [mention] - To mention/ping the user (e.g. ${msg.user})
                [members] - For the total member count of the server (e.g. ${msg.guild.memberCount})
                [username] - For the username (e.g. ${msg.user.username})
                [place] - For the place the user joined in (e.g. 5th)\``,
								fields: [
									{
										name: "Example",
										value: `Example Message: Welcome to [servername], [mention]!We now have [members] members\nThis would result in: Welcome to ${msg.guild.name}, ${msg.user}! We now have ${msg.guild.memberCount} members`
									}
								],
								color: this.client.config.colours.main
							}
						],
						ephemeral: true
					});
				case "goodbye":
					return await msg.reply({
						embeds: [
							{
								title: "Goodbye Message Info",
								description:
									"Goodbye messages are sent in a specific channel to welcome a member to your server. You can customise the message using these variables:\n" +
									`[tag] - For the user tag (e.g. ${msg.user.tag})
                                    [servername] - For the server name (e.g. ${msg.guild.name})
                                    [mention] - To mention/ping the user (e.g. ${msg.user})
                                    [members] - For the total member count of the server (e.g. ${msg.guild.memberCount})
                                    [username] - For the username (e.g. ${msg.user.username})`,
								fields: [
									{
										name: "Example",
										value: `Example Message: Goodbye [tag]! We hope you had a good time in [servername]! We now have [members] members\nThis would result in: Goodbye ${msg.user.tag}! We hope you had a good time in ${msg.guild.name}! We now have ${msg.guild.memberCount} members`
									}
								],
								color: this.client.config.colours.main
							}
						],
						ephemeral: true
					});
				case "autoroles":
					return await msg.reply({
						embeds: [
							{
								title: "Auto Role Info",
								description:
									"Auto roles are roles that are added to a user/bot on joining the server. If you set the user role, the role will be added to a user when it joins and if you set the bot role, the role will be added to a bot when it is invited. Corynth's highest role has to be above both of these roles (or one if you only use one) for it to function correctly"
							}
						],
						ephemeral: true
					});
				case "suggestions":
					return await msg.reply({
						embeds: [
							{
								title: "Suggestions Info",
								description:
									"Suggestions are a feature that allow users to send a suggestion to a specific channel. When a user runs `/suggest <suggestion>` it will get sent to your specified channel through a webhook created by the bot."
							}
						]
					});
			}
		} else if (opt == "view") {
			return await msg.reply({
				embeds: [
					{
						title: "Server Configuration",
						fields: [
							{
								name: "Prefix",
								value: msg.db.prefix
							},
							{
								name: "Suggestions",
								value: msg.db.suggestions ? "Enabled" : "Disabled"
							},
							{
								name: "Welcome Message",
								value: msg.db.join
									? `Channel: <#${msg.db.join.channel}>\nMessage: ${msg.db.join.message}`
									: "Disabled"
							},
							{
								name: "Goodbye Message",
								value: msg.db.leave
									? `Channel: <#${msg.db.join.channel}>\nMessage: ${msg.db.join.message}`
									: "Disabled"
							},
							{
								name: "Auto Role",
								value: msg.db.autorole
									? "User:" + msg.db.autorole.user
										? `<@&${msg.db.autorole.user}>`
										: "Disabled" + "\nBot" + msg.db.autorole.bot
										? `<@&${msg.db.autorole.bot}>`
										: "Disabled"
									: "Disabled"
							}
						],
						color: this.client.config.colours.main
					}
				],
				ephemeral: true
			});
		} else if (group == "edit") {
			if (opt == "autorole") {
				let enable = msg.options.getBoolean("enable");
				let type = msg.options.getString("type");
				if (!enable) {
					if (msg.db.autorole) {
						// @ts-ignore
						msg.db.autorole[type] = null;
					}
					await msg.reply(`Autorole for ${type}s has been disabled`);
				} else {
					let role = msg.options.getRole("role", false);
					if (!role)
						return msg.reply({
							content: "Role is required when enabling autorole",
							ephemeral: true
						});
					if (!msg.db.autorole) msg.db.autorole = {};
					//@ts-ignore
					msg.db.autorole[type] = role.id;
					await msg.reply({
						content: `Autorole for ${type}s has been set to ${role}. Please ensure that my highest role is above this role, otherwise it will be disabled`,
						ephemeral: true
					});
				}
			} else if (opt == "prefix") {
				//@ts-ignore
				msg.db.prefix = msg.options.getString("prefix").toLowerCase();
				await msg.reply({
					content: `Prefix has been set to ${msg.db.prefix}`,
					ephemeral: true
				});
			} else if (opt == "suggestions") {
				let enable = msg.options.getBoolean("enable");
				if (!enable) {
					msg.db.suggestions = null;
					await msg.reply({
						content: `Suggestions have been disabled`,
						ephemeral: true
					});
				} else {
					let channel = msg.options.getChannel("channel", false);
					if (!channel) {
						return await msg.reply({
							content: "Channel is required when enabling suggestions",
							ephemeral: true
						});
					}
					if (!msg.guild.me.permissions.has("MANAGE_WEBHOOKS"))
						return await msg.reply({
							embeds: [
								{
									description: `I don't have the required permission to set suggestions, as I need to be able to create a webhook. I need the \`Manage Webhooks\` permission to be able to create a webhook.`,
									color: this.client.config.colours.error
								}
							],
							ephemeral: true
						});
					//@ts-ignore
					if (channel.type != "GUILD_TEXT")
						return await msg.reply({
							content:
								"Suggestions only work with text channels, not voice channels or category channels.",
							ephemeral: true
						});
					const webhook = await channel.createWebhook(
						`${this.client.user.username} Suggestions`,
						{
							avatar: this.client.user.avatarURL()
						}
					);
					msg.db.suggestions = {
						id: webhook.id,
						token: webhook.token
					};
					await msg.reply({
						content: `Suggestions have been enabled and a webhook has been created in ${channel}.`,
						ephemeral: true
					});
				}
			} else if (opt == "welcome") {
				let enable = msg.options.getBoolean("enable");
				if (!enable) {
					msg.db.join = null;
					await msg.reply({
						content: `Welcome messages have been disabled`,
						ephemeral: true
					});
				} else {
					let channel = msg.options.getChannel("channel", false);
					let message = msg.options.getString("message", false);
					if (!channel)
						return await msg.reply({
							content: "Channel is required when setting the welcome message",
							ephemeral: true
						});
					if (!message)
						return await msg.reply({
							content: "Message is required when setting the welcome message",
							ephemeral: true
						});
					msg.db.join = {
						channel: channel.id,
						message
					};
					await msg.reply({
						content: "The welcome message has been configured successfully",
						ephemeral: true
					});
				}
			} else if (opt == "goodbye") {
				let enable = msg.options.getBoolean("enable");
				if (!enable) {
					msg.db.leave = null;
					await msg.reply({
						content: `Goodbye messages have been disabled`,
						ephemeral: true
					});
				} else {
					let channel = msg.options.getChannel("channel", false);
					let message = msg.options.getString("message", false);
					if (!channel)
						return await msg.reply({
							content: "Channel is required when setting the goodbye message",
							ephemeral: true
						});
					if (!message)
						return await msg.reply({
							content: "Message is required when setting the goodbye message",
							ephemeral: true
						});
					msg.db.leave = {
						channel: channel.id,
						message
					};
					await msg.reply({
						content: "The welcome message has been configured successfully",
						ephemeral: true
					});
				}
			}
			return await this.client.db.guilds.set(msg.db.id, msg.db);
		}
	}
};
