"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
const discord_js_light_1 = require("discord.js-light");
const fs_1 = require("fs");
const os_1 = __importDefault(require("os"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("stats", {
            description: "Find out the bot's statistics.",
            aliases: ["info"],
            usage: ""
        }, {
            owner: false,
            args: 0,
            permissions: {},
            cooldown: "5s"
        });
        this.client = client;
    }
    async run(msg) {
        var _a;
        const host = (await fs_1.promises.readFile("/etc/os-release"));
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
        const stats = (_a = this.client.music) === null || _a === void 0 ? void 0 : _a.stats;
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
                    value: [`Node.js: ${process.version}`, `discord.js-light: v${discord_js_light_1.version}`],
                },
                {
                    name: "Music Stats",
                    value: this.client.music ? [`Active Players: ${stats.playingPlayers}`, `Memory Usage: ${this.client.Util.memory(stats.memory.used)} MB`, `CPU Usage: ${Math.round(stats.cpu.lavalinkLoad * 100) / 100}%`, `Uptime: ${this.client.Util.timestamp(stats.uptime)}`] : "Currently Unavailable",
                },
                {
                    name: "Bot Usage",
                    value: [`Memory: ${this.client.Util.memory(process.memoryUsage().rss)}MB/${Math.round(this.client.Util.memory(os_1.default.totalmem(), "gb"))}GB (${Math.round(process.memoryUsage().rss / os_1.default.totalmem() * 1000) / 10}%)`, `Uptime: ${this.client.Util.timestamp(this.client.uptime)}`],
                },
                {
                    name: "System Stats",
                    value: [`Memory: ${this.client.Util.memory(os_1.default.totalmem(), "gb")}GB`, `OS: ${await this.client.Util.getOS()}`, `Uptime: ${this.client.Util.timestamp(os_1.default.uptime() * 1000)}`],
                }],
            color: this.client.config.colours.main
        };
        await msg.send("", { embed });
    }
};
