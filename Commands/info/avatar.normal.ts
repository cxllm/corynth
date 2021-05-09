import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
import Message from "../../Structs/Message";
export = class extends Command {
  private client: Client;

  constructor(client: Client) {
    super(
      {
        name: "avatar",
        description: "View yours or someone else's avatar.",
        defaultPermission: true
      },
      {
        owner: false,
        permissions: {},
        slash: false,
        usage: "[user]"
      }
    );
    this.client = client;
  }

  async run(msg: Message) {
    const { user } = await this.client.Util.getMember(msg);
    const url = user.displayAvatarURL({
      dynamic: true,
      size: 2048,
      format: "png"
    });
    const avatar = {
      png: user.displayAvatarURL({ format: "png" }),
      jpg: user.displayAvatarURL({ format: "jpg" }),
      gif: user.displayAvatarURL({ format: "gif" })
    };
    const embed = {
      title: `${user.tag}'s Avatar`,
      description: Object.keys(avatar)
        .map((i) => `[${i.toUpperCase()}](${avatar[i]})`)
        .join(" | "),
      image: {
        url
      },
      color: this.client.config.colours.main
    };
    return await msg.send({ embed });
  }
};
