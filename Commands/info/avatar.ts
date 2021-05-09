import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
export = class extends Command {
  private client: Client;

  constructor(client: Client) {
    super(
      {
        name: "avatar",
        description: "View your own or someone else's avatar.",
        defaultPermission: true,
        options: [
          {
            name: "user",
            description: "The user to get the avatar of",
            required: false,
            type: "USER"
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
    const user = msg.options[0]?.user || msg.user;
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
    return await msg.reply({ embeds: [embed] });
  }
};
