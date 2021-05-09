import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
  private client: Client;
  constructor(client: Client) {
    super(
      "bird",
      {
        description: "See a picture of a bird.",
        aliases: [],
        usage: "",
      },
      {
        owner: false,
        args: 0,
        permissions: {},
        cooldown: "5s",
      }
    );
    this.client = client;
  }
  async run(msg: Message) {
    await msg.send(this.client.presets.loading_image);
    let { data } = await this.client.web.get(
      `https://api.alexflipnote.dev/birb`,
      {
        headers: {
          Authorization: this.client.config.afn,
        },
      }
    );
    await msg.send({
      files: [
        {
          attachment: data.file,
          name: "bird.gif",
        },
      ],
    });
  }
};
