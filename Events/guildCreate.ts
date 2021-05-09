import Event from "../Structs/Event";
import Client from "../Structs/Client";
import { Guild } from "discord.js";

export = class extends Event {
  constructor(client: Client) {
    super(client, "guildCreate", "on");
  }
  async run(guild: Guild) {
    let guilddb = await this.client.db.guilds.get(guild.id);
    if (!guilddb) {
      guilddb = {
        prefix: this.client.config.prefix,
        ownerprefix: false
      };
      await this.client.db.guilds.set(guild.id, guilddb);
    }
    await this.client.webhooks.guilds.send({
      username: `New Server`,
      avatarURL: this.client.user.avatarURL(),
      embeds: [
        {
          title: "Server Added Me",
          description: `Now at ${this.client.guilds.cache.size} guilds`,
          fields: [
            {
              name: "Info",
              value: [
                `Name: \`${guild.name}\``,
                `Members: \`${guild.memberCount}\``,
                `Owner: \`${
                  (await this.client.users.fetch(guild.ownerID, false)).tag
                }\``,
                `ID: \`${guild.id}\``
              ]
            }
          ],
          thumbnail: {
            url: guild.iconURL()
          },
          color: this.client.config.colours.success,
          timestamp: Date.now()
        }
      ]
    });
  }
};
