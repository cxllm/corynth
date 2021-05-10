import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
export = class extends Command {
  private client: Client;

  constructor(client: Client) {
    super(
      {
        name: "changemymind",
        description: "Make a change my mind meme with your specified text",
        defaultPermission: true,
        options: [
          {
            name: "text",
            type: "STRING",
            required: true,
            description: "The text to put on the change my mind meme"
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
    let text = msg.options[0].value;
    //@ts-ignore
    if (text.length > 500)
      return await msg.editReply(this.client.presets.less_than_500);
    let data = await this.client.canva.changemymind(text);
    return await msg.editReply({
      files: [{ name: "changemymind.png", attachment: data }]
    });
  }
};
