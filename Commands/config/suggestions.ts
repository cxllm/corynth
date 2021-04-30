import { Collection, Message as M, MessageEmbedOptions } from "discord.js";
import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
  private client: Client;
  constructor(client: Client) {
    super(
      "suggestions",
      {
        description: "Turn suggestions on or off.",
        aliases: [],
        usage: "<on|off>",
      },
      {
        owner: false,
        args: 1,
        permissions: {
          user: "MANAGE_GUILD",
          bot: "MANAGE_WEBHOOKS",
        },
      }
    );
    this.client = client;
  }
  async run(msg: Message) {
    let arg = msg.args[0].toLowerCase();
    let embed: MessageEmbedOptions;
    let messages;
    let m: Message;
    switch (arg) {
      case "on":
        embed = {
          description:
            "Please mention a channel below, or type its ID. You have 15 seconds",
          color: this.client.config.colours.main,
        };
        m = await msg.send({ embed });
        try {
          messages = await msg.channel.awaitMessages(
            (m) => m.author.id == msg.author.id,
            {
              max: 1,
              time: 15000,
              errors: ["time"],
            }
          );
        } catch {
          return await m.edit("Timed out");
        }
        let chan =
          messages.first().mentions.channels.first() ||
          msg.guild.channels.cache.get(messages.first().content);
        if (!chan || chan.type != "text")
          return await msg.send(
            `${this.client.config.emojis.cross} Invalid Channel!`
          );
        const webhook = await chan.createWebhook(
          `${this.client.user.username} Suggestions`,
          {
            avatar: this.client.user.avatarURL(),
          }
        );
        msg.db.suggestions = {
          id: webhook.id,
          token: webhook.token,
        };
        await this.client.db.guilds.set(msg.guild.id, msg.db);
        await msg.send(
          `${this.client.config.emojis.tick} Suggestions channel set!`
        );
        break;
      case "off":
        delete msg.db.suggestions;
        await this.client.db.guilds.set(msg.guild.id, msg.db);
        await msg.send(
          `${this.client.config.emojis.tick} Suggestions turned off, you may wish to remove the webhook.`
        );
        break;
      default:
        await msg.send(this.client.UsageEmbed(this));
        break;
    }
  }
};
