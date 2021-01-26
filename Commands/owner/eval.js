const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
const clean = text => {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}
module.exports = class extends Command {
    constructor() {
        super("eval", {
            help: {
                aliases: [],
                usage: "<code>",
                description: "Evaluate some code"
            },
            config: {
                args: 1,
                permissions: {
                    user: false,
                    bot: false
                },
                owner: true
            }
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        const strings = [client.config.token, client.config.mongo, ...Object.keys(client.config.webhooks).map(w => client.config.webhooks[w]), client.music.rest?.url]
        strings.map(string => {
            strings.push(string.toLowerCase(), string.toUpperCase(), string.toProperCase())
        })
        let code = msg.args.join(" ")
        try {
            let evaled = await eval(code);
            const type = typeof evaled;
            if (type != "string")
                evaled = require("util").inspect(evaled);
            for (const string of strings) {
                evaled = evaled.replace(string, "REDACTED")
            }
            evaled = clean(evaled)
            const embed = {
                title: "Eval Output - Success",
                fields: [{
                    name: "Input",
                    value: `\`\`\`js\n${code.substring(0, 1015)}\`\`\``
                },
                {
                    name: "Output",
                    value: `\`\`\`js\n${evaled.substring(0, 1015)}\`\`\``
                },
                {
                    name: "Output Type",
                    value: type.toProperCase()
                }],
                color: client.config.colours.main
            }
            if (evaled.length > 1015) embed.fields.push({
                name: "Full Output",
                value: await client.Util.genSourcebin(evaled, "Success", "js", `Eval Output from ${client.user.tag}`, client.user.tag)
            })
            msg.reply({ embed });
        } catch (err) {
            const embed = {
                title: "Eval Output - Error",
                fields: [{
                    name: "Input",
                    value: `\`\`\`js\n${code.substring(0, 1015)}\`\`\``
                },
                {
                    name: "Error",
                    value: `\`\`\`js\n${err.toString().substring(0, 1015)}\`\`\``
                }],
                color: client.config.colours.error
            }
            console.log(err)
            if (err.toString().length > 1015) embed.fields.push({
                name: "Full Error",
                value: await client.Util.genSourcebin(err, "Error", "js", `Eval Output from ${client.user.tag}`)

            })
            msg.reply({ embed });
        }
    }
}