const Event = require("../Structs/Event")
const Client = require("../Structs/Client")
const { Guild } = require("discord.js-light")
module.exports = class extends Event {
    constructor() {
        super("guildDelete", {
            method: "on"
        })
    }
    /**
     * 
     * @param {Client} client
     * @param {Guild} guild 
     */
    async run(client, guild) {
        let guilddb = await client.db.Guilds.get(guild.id);
        if (guilddb) await client.db.Guilds.delete(guild.id)
        await client.webhooks.guilds.send({
            username: `Server Left`,
            avatarURL: client.user.avatarURL(),
            embeds: [
                {
                    title: "Server Removed Me",
                    description: `Now at ${client.guilds.cache.size} guilds`,
                    fields: [
                        {
                            name: "Info",
                            value: [
                                `Name: \`${guild.name}\``,
                                `Members: \`${guild.memberCount}\``,
                                `Owner: \`${(await client.users.fetch(guild.ownerID, false)).tag}\``,
                                `ID: \`${guild.id}\``
                            ]
                        }
                    ],
                    thumbnail: {
                        url: guild.iconURL()
                    },
                    color: client.config.colours.success,
                    timestamp: Date.now()
                }
            ]
        })
    }
}