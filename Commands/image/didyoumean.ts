import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
  private client: Client;
  constructor(client: Client) {
    super(
      "didyoumean",
      {
        description:
          "Create a google did you mean scenario with your own custom text.",
        aliases: [],
        usage: "<text> | <text>",
      },
      {
        owner: false,
        args: 3,
        permissions: {},
        cooldown: "5s",
      }
    );
    this.client = client;
  }
  async run(msg: Message) {
    let arr = msg.args.join(" ").split("|");
    if (!arr || arr.length != 2)
      return await msg.send(this.client.UsageEmbed(this));
    let text = [arr[0], arr[1]];
    if (!arr || !text) return await msg.send(this.client.presets.no_text);
    for (let str in text) {
      if (!text[str]) return await msg.send(this.client.UsageEmbed(this));
      if (text[str].length > 500)
        return await msg.send(this.client.presets.less_than_500);
      else text[str] = encodeURIComponent(text[str]);
    }
    try {
      let { data } = await this.client.web.get(
        `https://api.alexflipnote.dev/didyoumean?top=${text[0]}&bottom=${text[1]}`,
        {
          responseType: "arraybuffer",
          headers: {
            Authorization: this.client.config.afn,
          },
        }
      );
      await msg.send("", {
        files: [
          {
            attachment: data,
            name: "didyoumean.png",
          },
        ],
      });
    } catch {
      await msg.send(this.client.presets.chars_inv);
    }
  }
};
