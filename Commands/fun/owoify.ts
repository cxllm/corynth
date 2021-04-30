import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
  private client: Client;
  constructor(client: Client) {
    super(
      "owoify",
      {
        description: "OwOify some text.",
        aliases: ["owo"],
        usage: "<text>",
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
    const text = encodeURIComponent(msg.args.join(" "));
    const { data } = await this.client.web.get(
      `https://nekos.life/api/v2/owoify?text=${text}`
    );
    let embed = {
      description: data.owo,
      color: this.client.config.colours.main,
    };
    await msg.send({ embed });
  }
};
