import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
  private client: Client;
  constructor(client: Client) {
    super(
      "captcha",
      {
        description: "Make a captcha with your own custom text.",
        aliases: ["recaptcha"],
        usage: "<text>",
      },
      {
        owner: false,
        args: 1,
        permissions: {},
        cooldown: "5s",
      }
    );
    this.client = client;
  }
  async run(msg: Message) {
    let text = encodeURIComponent(msg.args.join(" "));
    if (text.length > 500)
      return await msg.send(this.client.presets.less_than_500);
    let { data } = await this.client.web.get(
      `https://api.alexflipnote.dev/captcha?text=${text}`,
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
          name: "captcha.png",
        },
      ],
    });
  }
};
