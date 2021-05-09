import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
export = class extends Command {
  private client: Client;

  constructor(client: Client) {
    super(
      {
        name: "owoify",
        description: "OwOify some text",
        defaultPermission: true,
        options: [
          {
            type: "STRING",
            description: "Text to owoify",
            name: "text",
            required: true
          }
        ]
      },
      {
        owner: false,
        permissions: {},
        slash: true
      }
    );
    this.client = client;
  }

  async run(msg: CommandInteraction) {
    await msg.defer();
    const text = encodeURIComponent(msg.options[0].value);
    const { data } = await this.client.web.get(
      `https://nekos.life/api/v2/owoify?text=${text}`
    );
    if (data.msg) {
      return await msg.editReply("Text must be shorter than 200 characters!");
    }
    await msg.editReply({
      embeds: [
        {
          description: data.owo,
          color: this.client.config.colours.main
        }
      ]
    });
  }
};
