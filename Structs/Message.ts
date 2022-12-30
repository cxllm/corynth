import {
	Message as M,
	MessageAttachment,
	MessageOptions,
	MessagePayload,
	Collection
} from "discord.js-light";
import Corynth from "./Client";

//@ts-ignore
export default class Message extends M {
	client: Corynth;
	response: {
		id: string;
		attachments: boolean;
		embeds: boolean;
		timestamp: number;
	};
	args: string[];
	db: any;
	public attachments: Collection<string, MessageAttachment>;
}
