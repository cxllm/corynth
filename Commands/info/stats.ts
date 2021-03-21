import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { version } from "discord.js-light";
import { promises as fs } from "fs";
import os from "os";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("stats", {
            description: "Find out the bot's statistics.",
            aliases: ["info"],
            usage: ""
        }, {
            owner: false,
            args: 0,
            permissions: {},
            cooldown: "5s"
        })
        this.client = client;
    }
    async run(msg: Message) {

        const host = (await fs.readFile("/etc/os-release"))
        const m = await msg.send("Loading statistics, please wait...");
        const latency = {
            db: {
                live: await this.client.Util.dbLatency(msg, false),
                //cache: this.client.Util.dbLatency(msg, true)
            },
            msg: {
                create: m.createdTimestamp - msg.createdTimestamp,
            },
            client: Math.round(this.client.ws.ping)
        };
        const stats = this.client.music?.stats;
        const embed = {
            title: "Bot Info",
            thumbnail: { url: this.client.user.avatarURL({ format: "png" }) },
            fields: [{
                name: "Statistics",
                value: [`Servers: ${this.client.guilds.cache.size}`, `Users: ${this.client.Util.totalUsers()}`, `Cached Users: ${this.client.users.cache.size}`],
            },
            {
                name: "Latency",
                value: [`Message Response: ${latency.msg.create}ms`, `Database Response: ${latency.db.live}ms`, `Client To Discord: ${latency.client}ms`],
            },
            {
                name: "Versions",
                value: [`Node.js: ${process.version}`, `discord.js-light: v${version}`],
            },
            {
                name: "Music Stats",
                value: this.client.music ? [`Active Players: ${stats.playingPlayers}`, `Memory Usage: ${this.client.Util.memory(stats.memory.used)} MB`, `CPU Usage: ${Math.round(stats.cpu.lavalinkLoad * 100) / 100}%`, `Uptime: ${this.client.Util.timestamp(stats.uptime)}`] : "Currently Unavailable",
            },
            {
                name: "Bot Usage",
                value: [`Memory: ${this.client.Util.memory(process.memoryUsage().heapUsed)}MB/${Math.round(this.client.Util.memory(os.totalmem(), "gb"))}GB (${Math.round(process.memoryUsage().heapUsed / os.totalmem() * 1000) / 10}%)`, `Uptime: ${this.client.Util.timestamp(this.client.uptime)}`],
            },
            {
                name: "System Stats",
                value: [`Memory: ${this.client.Util.memory(os.totalmem(), "gb")}GB`, `OS: ${await this.client.Util.getOS()}`, `Uptime: ${this.client.Util.timestamp(os.uptime() * 1000)}`],
            }],
            color: this.client.config.colours.main
        }
        await msg.send("", { embed })
    }
}