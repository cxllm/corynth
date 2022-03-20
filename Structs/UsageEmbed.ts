import config from "../config";
import Command from "./Command";

const {
	colours: { error }
} = config;

export default function (command: Command) {
	return {
		embeds: [
			{
				description: `Incorrect usage of ${command.name}`,
				fields: [
					{
						name: "Command Description",
						value: command.info.description
					},
					{
						name: "Command Usage",
						value: `${command.name} ${command.config.usage || ""}`
					}
				],
				footer: {
					text: "Usage: <> is required and [] is optional"
				},
				color: error
			}
		]
	};
}
