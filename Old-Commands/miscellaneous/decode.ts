import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
  private client: Client;
  constructor(client: Client) {
    super(
      "decode",
      {
        description:
          "Decode text from your choice of different encoding methods.",
        aliases: [],
        usage: "<binary|hex|base64>",
      },
      {
        owner: false,
        args: 1,
        permissions: {},
      }
    );
    this.client = client;
  }
  async run(msg: Message) {
    let type = msg.args[0].toLowerCase(),
      text = msg.args.slice(1).join(" ");
    try {
      const decoded = this.client.Util.decode(type, text);
      let embed = {
        title: `Decoded Text into ${type.toProperCase()}`,
        description: decoded,
        color: this.client.config.colours.main,
      };
      await msg.send({ embed });
    } catch {
      return await msg.send(this.client.UsageEmbed(this));
    }
  }
};
