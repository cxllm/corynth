import config from "../config";
import Command from "./Command";
const { emojis, colours: { error } } = config

export default function (command: Command) {
    return {
        embed: {
            description: `${emojis.cross} Incorrect usage of ${command.name}`,
            fields: [
                {
                    name: "Command Description", value: command.info.description
                },
                {
                    name: "Command Usage", value: `${command.name} ${command.info.usage}`
                }
            ],
            footer: {
                text: "Usage: <> is required and [] is optional"
            },
            color: error
        }
    }
}