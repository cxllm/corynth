const Event = require("../Structs/Event")
const Client = require("../Structs/Client")

module.exports = class Resume extends Event {
    constructor() {
        super("shardResume", {
            method: "on"
        })
    }
    /**
     * 
     * @param {Client} client 
     */
    async run(client) {
        client.logger.log(`The client has reconnected to the gateway`);
        await client.webhooks.connections.send({
            username: `Reconnected`,
            avatarURL: client.user.avatarURL(),
            embeds: [
                {
                    title: "Client Reconnected",
                    description: `The client has reconnected to the gateway`,
                    color: client.config.colours.success,
                    timestamp: Date.now()
                }
            ]
        })
    }
}