const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
const dependencies = require("../../package.json").dependencies
let pjson = {}
Object.keys(dependencies).map(d => {
    pjson[d] = "v" + dependencies[d].slice(1)
});
const versions = {
    node: process.version,
    djs_light: pjson["discord.js-light"]
}
const os = require("os");
module.exports = class extends Command {
    constructor() {
        super("stats", {
            help: {
                aliases: ["info"],
                usage: "",
                description: "View info and stats about the bot"
            },
            config: {
                args: false,
                permissions: {
                    user: false,
                    bot: false
                },
                owner: false,
                cooldown: false
            }
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        const memory = client.Util.memory;
        const latency = {
            client: Math.round(client.ws.ping) + "ms",
            database: {
                cache: Math.ceil(await client.Util.dbLatency(msg, true)) + "ms",
                live: Math.round(await client.Util.dbLatency(msg, false) * 100) / 100 + "ms"
            }
        }
        const node = client.music.stats;
        await msg.reply({
            embed: {
                title: "Bot Info and Stats",
                thumbnail: {
                    url: client.user.avatarURL()
                },
                fields: [
                    {
                        name: "Stats",
                        value: [`Guilds: ${client.guilds.cache.size}`, `Total Users: ${client.Util.totalUsers().toLocaleString()}`, `Cached Users: ${client.users.cache.size.toLocaleString()}`, `Uptime: ${client.Util.duration(client.uptime)}`],
                        inline: true
                    },
                    {
                        name: "Latency",
                        value: [`Client: ${latency.client}`, `Database:`, `Cache: ${latency.database.cache}`, `Live: ${latency.database.live}`],
                        inline: true
                    },
                    {
                        name: "Music (Lavalink)",
                        value: [`Current Players: ${node.players}`, `Uptime: ${client.Util.duration(node.uptime)}`, `CPU Usage: ${Math.round(node.cpu.lavalinkLoad * 1000) / 10}%`],
                        inline: true
                    },
                    {
                        name: "Memory Usage",
                        value: `${memory(process.memoryUsage().heapUsed)} MB (${Math.round(memory(process.memoryUsage().heapUsed / memory(os.totalmem()) * 1000)) / 10}%)`,
                        inline: true
                    },
                    {
                        name: "Versions",
                        value: [`Node.js: ${versions.node}`, `Discord.js-light: ${versions.djs_light}`],
                        inline: true
                    },
                    {
                        name: "Hosting",
                        value: [`Memory: ${Math.round(memory(os.totalmem()) / 1000)}GB`, `OS: ${os.type}`, `Uptime: ${client.Util.duration(os.uptime * 1000)}`],
                        inline: true
                    },

                ],
                color: client.config.colours.main
            }
        })
    }
}