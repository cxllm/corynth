import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { exec } from "child_process";

export = class extends Command {
  private client: Client;

  constructor(client: Client) {
    super(
      {
        name: "restart",
        description: "Restart the bot."
      },
      {
        owner: true,
        args: 0,
        slash: false,
        permissions: {},
        aliases: ["reboot"]
      }
    );
    this.client = client;
  }

  async run(msg: Message) {
    await msg.send("Exited the process.");
    process.exit();
  }
};
