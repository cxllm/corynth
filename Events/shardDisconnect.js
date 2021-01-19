const Event = require("../Structs/Event")
const Client = require("../Structs/Client")

module.exports = class extends Event {
    constructor() {
        super("shardDisconnect", {
            method: "on"
        })
    }
    /**
    *
    * @param {Client} client
    */
    async run(client) {
        client.logger.log(`The client has disconnected from the gateway`);
        await client.webhooks.connections.send({
            username: `Disconnected`,
            avatarURL: client.user.avatarURL(),
            embeds: [
                {
                    title: "Client Disconnected",
                    description: `The client has disconnected from the gateway`,
                    color: client.config.colours.error,
                    timestamp: Date.now()
                }
            ]
        })
    }
}