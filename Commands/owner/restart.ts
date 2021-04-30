import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { exec } from "child_process";
export = class extends Command {
  private client: Client;
  constructor(client: Client) {
    super(
      "restart",
      {
        description: "Restart the bot.",
        aliases: ["reboot"],
        usage: "",
      },
      {
        owner: true,
        args: 0,
        permissions: {},
      }
    );
    this.client = client;
  }
  async run(msg: Message) {
    await msg.send("Restarted");
    process.exit();
  }
};
