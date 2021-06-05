import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { Canvas } from "canvacord";
export = class extends Command {
  private client: Client;

  constructor(client: Client) {
    super(
      {
        name: "changemymind",
        description: "Make a change my mind meme with your specified text",
        defaultPermission: true
      },
      {
        owner: false,
        permissions: {},
        slash: false,
        args: 1,
        usage: "<text>"
      }
    );
    this.client = client;
  }

  async run(msg: Message) {
    await msg.send(this.client.presets.edit_image);
    let text = msg.args.join(" ");
    if (text.length > 500)
      return await msg.send(this.client.presets.less_than_500);
    let data = await Canvas.changemymind(text);
    return await msg.send({
      files: [{ name: "changemymind.png", attachment: data }]
    });
  }
};
