import Event from "../Structs/Event";
import Client from "../Structs/Client";
import { PresenceData } from "discord.js";
export = class extends Event {

    constructor(client: Client) {
        super(client, "ready", "on");
    }
    async run() {
        this.client.logs.connection(`Client Connected as ${this.client.user.tag}`);
        const activity: PresenceData = { status: "dnd", activity: { name: `@${this.client.user.username} | ${this.client.website}` } };
        this.client.links["invite link"] = `https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot`
        this.client.user.setPresence(activity);
        this.client.Util.updateCovid19Info();
        this.client.server.listen(this.client.config.ping_server, () => this.client.logs.log(`Ping server is listening on port ${this.client.config.ping_server}`));
        if (this.client.user.id !== "692779290399604766") await this.client.Util.botLists();
        await this.checkUsers();
        await this.client.webhooks.connections.send({
            username: `Ready`,
            avatarURL: this.client.user.avatarURL(),
            embeds: [
                {
                    title: "Client Connected",
                    description: `The client has identified in the gateway as ${this.client.user.tag}`,
                    color: this.client.config.colours.success,
                    timestamp: Date.now()
                }
            ]
        });
        setInterval(() => {
            this.client.users.cache.clear();
            this.client.db.guilds.clearCache();
        }, 10 * 60 * 1000)
        setTimeout(async () => {
            this.client.user.setPresence(activity);
            await this.client.Util.updateCovid19Info();
            if (this.client.user.id !== "692779290399604766") await this.client.Util.botLists();
            await this.checkUsers()
        }, 30 * 60 * 1000)
    }
    async checkUsers() {
        const data = this.client.db.users.collection.find({});
        data.on("data", async (data: { id: string, cooldown: Array<{ end: number }> }) => {
            data.cooldown.map(cooldown => {
                if (cooldown.end < Date.now()) data.cooldown.splice(data.cooldown.indexOf(cooldown), 1)
            });
            if (!data.cooldown.length) await this.client.db.users.delete(data.id);
            else this.client.db.users.set(data.id, data)
        })
    }
}