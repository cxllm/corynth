"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const util_1 = require("util");
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("eval", {
            description: "Evaluate some code.",
            aliases: ["ev", "e"],
            usage: "<code>"
        }, {
            owner: true,
            args: 1,
            permissions: {}
        });
        this.client = client;
    }
    async run(msg) {
        var _a;
        const strings = [this.client.config.token, this.client.config.mongo, ...Object.keys(this.client.config.webhooks).map(w => this.client.config.webhooks[w]), (_a = this.client.music.rest) === null || _a === void 0 ? void 0 : _a.url];
        strings.map(string => {
            strings.push(string.toLowerCase(), string.toUpperCase(), string.toProperCase());
        });
        let code = msg.args.join(" ");
        try {
            let evaled = await eval(code);
            const type = typeof evaled;
            if (type != "string")
                evaled = util_1.inspect(evaled);
            for (let string of strings) {
                evaled = evaled.replace(string, "REDACTED");
            }
            evaled = this.clean(evaled);
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
                color: this.client.config.colours.main
            };
            msg.send({ embed });
        }
        catch (err) {
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
                color: this.client.config.colours.error
            };
            console.log(err);
            msg.send({ embed });
        }
    }
    clean(text) {
        if (typeof text === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }
};
