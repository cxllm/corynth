import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
  private client: Client;

  constructor(client: Client) {
    super(
      {
        name: "captcha",
        description: "Make a captcha with your specified text",
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
    let text = encodeURIComponent(msg.args.join(" "));
    if (text.length > 500)
      return await msg.send(this.client.presets.less_than_500);
    let { data } = await this.client.web.get(
      `https://api.alexflipnote.dev/captcha?text=${text}`,
      {
        responseType: "arraybuffer",
        headers: {
          Authorization: this.client.config.afn
        }
      }
    );
    return await msg.send({
      files: [{ name: "captcha.png", attachment: data }]
    });
  }
};
