const Event = require("../Structs/Event");
const Client = require("../Structs/Client");
module.exports = class extends Event {
    constructor() {
        super("ready", {
            method: "on"
        })
    }
    /**
     * 
     * @param {Client} client 
     */
    async run(client) {
        const presence = `@${client.user.username} help | ${client.website}`
        client.logger.connection(`The client has connected to the gateway as ${client.user.tag}`);
        client.user.setPresence({ activity: { name: presence }, status: 'dnd' })
        setInterval(() => {
            client.user.setPresence({ activity: { name: presence }, status: 'dnd' })

        }, 30 * 60 * 1000);
        client.links["invite link"] = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`
        await client.Util.updateCovid19Info();
        async function checkUsers() {
            const data = await client.db.Users.collection.find({});
            data.on("data", async (data) => {
                data.cooldown.map(cooldown => {
                    if (cooldown.end < Date.now()) data.cooldown.splice(data.cooldown.indexOf(cooldown), 1)
                });
                if (!data.cooldown.length) await client.db.Users.delete(data.id);
                else client.db.Users.set(data.id, data)
            })
        }
        if (client.user.id !== "692779290399604766") await client.Util.botLists();
        await checkUsers();
        await client.webhooks.connections.send({
            username: `Ready`,
            avatarURL: client.user.avatarURL(),
            embeds: [
                {
                    title: "Client Connected",
                    description: `The client has identified in the gateway as ${client.user.tag}`,
                    color: client.config.colours.success,
                    timestamp: Date.now()
                }
            ]
        });
        setInterval(async () => {
            client.Util.tokenPush()
        }, 60000)
        setInterval(async () => {
            if (client.user.id !== "692779290399604766") await client.Util.botLists();
            await client.Util.updateCovid19Info();
            await checkUsers();
        }, 30 * 60 * 1000);
    }
}