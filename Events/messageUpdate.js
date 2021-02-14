const Event = require("../Structs/Event")
const Client = require("../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Event {
    constructor() {
        super("messageUpdate", {
            method: "on"
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} oldmsg 
     * @param {Message} msg 
     */
    async run(client, oldmsg, msg) {
        if (oldmsg.content === msg.content) return;
        client.events.get("message").run(client, msg)
    }
}