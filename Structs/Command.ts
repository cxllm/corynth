import {
	PermissionString,
	MessageApplicationCommandData,
	ChatInputApplicationCommandData
} from "discord.js-light";

interface config {
	permissions: {
		user?: PermissionString;
		bot?: PermissionString;
	};
	owner: boolean;
	cooldown?: string;
	filter?: boolean;
	slash: boolean;
	category?: string;
	args?: number;
	usage?: string;
	aliases?: string[];
	guild?: boolean;
}

import Message from "./Message";
import CommandInteraction from "./CommandInteraction";

export default class Command {
	name: string;
	info: ChatInputApplicationCommandData;
	config: config;

	constructor(info: ChatInputApplicationCommandData, config: config) {
		this.info = info;
		this.config = config;
		this.name = this.info.name;
	}

	async run(msg: Message | CommandInteraction): Promise<any> {
		return msg;
	}
}
export type { config };
