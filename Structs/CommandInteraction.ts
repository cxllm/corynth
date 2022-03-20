import { CommandInteraction } from "discord.js-light";
import Corynth from "./Client";

export default class extends CommandInteraction {
	client: Corynth;
	db: any;
}
