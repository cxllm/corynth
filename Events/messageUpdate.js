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
    async run(client, _, msg) {
        client.events.get("message").run(client, msg)
    }
}