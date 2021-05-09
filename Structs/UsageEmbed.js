let { emojis, colours: { error } } = require("../config")

module.exports = function (command) {
    return {
        embed: {
            description: `${emojis.cross} Incorrect usage of ${command.name}`,
            fields: [
                {
                    name: "Command Description", value: command.help.description
                },
                {
                    name: "Command Usage", value: `${command.name} ${command.help.usage}`
                }
            ],
            footer: {
                text: "Usage: <> is required and [] is optional"
            },
            color: error
        }
    }
}