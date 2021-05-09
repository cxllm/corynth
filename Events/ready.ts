import Event from "../Structs/Event";
import Client from "../Structs/Client";
import { PresenceData } from "discord.js-light";

export = class extends Event {
  constructor(client: Client) {
    super(client, "ready", "on");
  }

  async run() {
    this.client.logs.connection(`Client Connected as ${this.client.user.tag}`);
    let presence: PresenceData = {
      activities: [
        {
          name: `@${this.client.user.username} | v${this.client.getVersion()}`
        }
      ],
      status: "idle"
    };
    this.client.links[
      "invite link"
    ] = `https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=applications.commands%20bot`;
    this.client.user.setPresence(presence);
    await this.client.Util.updateCovid19Info();
    this.client.server.listen(this.client.config.ping_server, () =>
      this.client.logs.log(
        `Ping server is listening on port ${this.client.config.ping_server}`
      )
    );
    if (!this.client.Util.checkTesting()) await this.client.Util.botLists();
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
    await this.client.Util.updateSlashCommands();
    setInterval(() => {
      this.client.users.cache.clear();
      this.client.db.guilds.clearCache();
    }, 10 * 60 * 1000);
    setInterval(async () => {
      presence.activities[0].name = `@${
        this.client.user.username
      } | v${this.client.getVersion()}`;

      this.client.user.setPresence(presence);
      await this.client.Util.updateCovid19Info();
      if (!this.client.Util.checkTesting()) await this.client.Util.botLists();
      await this.checkUsers();
    }, 30 * 60 * 1000);
  }

  async checkUsers() {
    const data = this.client.db.users.collection.find({});
    data.on(
      "data",
      async (data: { id: string; cooldown: Array<{ end: number }> }) => {
        data.cooldown.map((cooldown) => {
          if (cooldown.end < Date.now())
            data.cooldown.splice(data.cooldown.indexOf(cooldown), 1);
        });
        if (!data.cooldown.length) await this.client.db.users.delete(data.id);
        else this.client.db.users.set(data.id, data);
      }
    );
  }
};
