import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
import Message from "../../Structs/Message";
export = class extends Command {
  private client: Client;

  constructor(client: Client) {
    super(
      {
        name: "coin",
        description: "Flip a coin",
        defaultPermission: true
      },
      {
        owner: false,
        permissions: {},
        slash: false,
        aliases: ["coinflip"]
      }
    );
    this.client = client;
  }

  async run(msg: Message) {
    const coin = !!Math.round(Math.random()) ? "Heads" : "Tails";
    return await msg.send(`🪙 Coin Flip Outcome: \`${coin}\``);
  }
};
