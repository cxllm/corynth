"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("filter-list", {
            description: "View the filters you can change.",
            aliases: [],
            usage: ""
        }, {
            owner: false,
            args: 0,
            permissions: {},
            cooldown: "1s",
            filter: false
        });
        this.client = client;
    }
    async run(msg) {
        const filters = this.client.commands.filter(c => c.config.filter);
        let embed = {
            title: 'Filter Commands',
            description: filters.map(f => `**${f.name}** (${f.info.description}) - Usage: \`${msg.db.prefix}${f.name} ${f.info.usage}\``).join("\n"),
            color: this.client.config.colours.main
        };
        await msg.send({ embed });
    }
};
