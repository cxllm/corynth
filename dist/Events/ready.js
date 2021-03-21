"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Event_1 = __importDefault(require("../Structs/Event"));
module.exports = class extends Event_1.default {
    constructor(client) {
        super(client, "ready", "on");
    }
    async run() {
        this.client.logs.connection(`Client Connected as ${this.client.user.tag}`);
        const activity = `@${this.client.user.username} | ${this.client.website}`;
        this.client.links["invite link"] = `https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot`;
        this.client.user.setActivity(activity);
        this.client.Util.updateCovid19Info();
        this.client.Util.tokenPush();
        setInterval(() => {
            this.client.Util.tokenPush();
        }, 60 * 1000);
        setInterval(() => {
            this.client.users.cache.clear();
            this.client.db.guilds.clearCache();
        }, 10 * 60 * 1000);
        setTimeout(() => {
            this.client.user.setActivity(activity);
            this.client.Util.updateCovid19Info();
        }, 30 * 60 * 1000);
    }
};
