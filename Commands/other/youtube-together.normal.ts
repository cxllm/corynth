import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
import Message from "../../Structs/Message";

export = class extends Command {
  private client: Client;

  constructor(client: Client) {
    super(
      {
        name: "youtube-together",
        description: "Start a YouTube Together session in a voice channel.",
        defaultPermission: true
      },
      {
        owner: false,
        permissions: {},
        slash: false,
        args: 1,
        usage: "<voice channel id or mention>",
        aliases: ["youtube", "yt", "yt-together"]
      }
    );
    this.client = client;
  }

  async run(msg: Message) {
    await msg.send(this.client.presets.loading);
    let channel =
      msg.mentions.channels.first() ||
      msg.guild.channels.cache.get(msg.args[0]);
    if (!channel) return await msg.send(`Invalid channel provided!`);
    if (channel.type != "voice")
      return await msg.send("YouTube Together only works in voice channels!");
    try {
      let { data } = await this.client.web.post(
        `https://discord.com/api/v${this.client.options.http.version}/channels/${channel.id}/invites`,
        {
          max_age: 86400,
          max_uses: 0,
          target_application_id: "755600276941176913",
          target_type: 2,
          temporary: false,
          validate: null
        },
        {
          headers: {
            Authorization: `Bot ${this.client.token}`,
            "Content-Type": "application/json"
          }
        }
      );
      if (!data.code) throw "No invite code";
      return await msg.send(
        `YouTube Together activity has been created in <#${channel.id}>. To start it, click this link - <https://discord.gg/${data.code}>`
      );
    } catch {
      return await msg.send(
        "There was an error starting the YouTube Together activity"
      );
    }
  }
};
