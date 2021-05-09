import {
	PermissionString,
	ApplicationCommandOptionData,
	ApplicationCommandData
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
	info: ApplicationCommandData;
	config: config;

	constructor(info: ApplicationCommandData, config: config) {
		this.info = info;
		this.config = config;
		this.name = this.info.name;
	}

	async run(msg: Message | CommandInteraction): Promise<any> {
		return msg;
	}
}
export type { config };
