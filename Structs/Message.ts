import { Message as M, MessageOptions, Structures } from "discord.js-light";
import Corynth from "./Client";

export default class Message extends M {
  client: Corynth;
  response: {
    id: string;
    attachments: boolean;
    embeds: boolean;
    timestamp: number;
  };
  args: string[];
  db: any;

  async send(
    content: string | MessageOptions,
    options?: MessageOptions
  ): Promise<Message> {
    if (typeof content === "string") {
      if (!options) {
        options = {};
      }
      options.content = content;
    } else {
      options = content;
      if (!options.content) options.content = "";
    }
    options.allowedMentions = { repliedUser: false };
    let sent;
    let previous = this.response;
    if (previous) {
      let msg =
        typeof this.channel.messages.forge === "function"
          ? this.channel.messages.forge(previous.id)
          : await this.channel.messages.fetch(previous.id, false);
      if (previous.attachments || options.files) {
        try {
          await msg.delete();
        } catch {}
        sent = await this.reply(options);
      } else {
        if (previous.embeds && !options.embed) {
          options.embed = null;
        }
        try {
          sent = await msg.edit(options);
        } catch {
          sent = await this.reply(options);
        }
      }
    } else {
      sent = await this.reply(options);
    }
    this.response = {
      id: sent.id,
      attachments: Boolean(sent.attachments.size),
      embeds: Boolean(sent.embeds.length),
      timestamp: Date.now()
    };
    return sent;
  }
}
Structures.extend(
  "Message",
  (M) =>
    class Message extends M {
      client: Corynth;
      response: {
        id: string;
        attachments: boolean;
        embeds: boolean;
        timestamp: number;
      };

      async send(content: string | MessageOptions, options?: MessageOptions) {
        if (typeof content === "string") {
          if (!options) {
            options = {};
          }
          options.content = content;
        } else {
          options = content;
          if (!options.content) options.content = "";
        }
        options.allowedMentions = { repliedUser: false };
        let sent;
        let previous = this.response;
        if (previous) {
          let msg =
            typeof this.channel.messages.forge === "function"
              ? this.channel.messages.forge(previous.id)
              : await this.channel.messages.fetch(previous.id, false);
          if (previous.attachments || options.files) {
            try {
              await msg.delete();
            } catch {}
            sent = await this.reply(options);
          } else {
            if (previous.embeds && !options.embed) {
              options.embed = null;
            }
            try {
              sent = await msg.edit(options);
            } catch {
              sent = await this.reply(options);
            }
          }
        } else {
          sent = await this.reply(options);
        }
        this.response = {
          id: sent.id,
          attachments: Boolean(sent.attachments.size),
          embeds: Boolean(sent.embeds.length),
          timestamp: Date.now()
        };
        return sent;
      }
    }
);
