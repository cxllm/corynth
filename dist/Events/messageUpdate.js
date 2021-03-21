"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Event_1 = __importDefault(require("../Structs/Event"));
module.exports = class extends Event_1.default {
    constructor(client) {
        super(client, "messageUpdate", "on");
    }
    async run(oldMsg, msg) {
        if (msg.author.bot || (oldMsg === null || oldMsg === void 0 ? void 0 : oldMsg.content) == msg.content)
            return;
        this.client.events.get("message").run(msg);
    }
};
