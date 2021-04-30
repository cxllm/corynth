import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { exec } from "child_process";
export = class extends Command {
  private client: Client;
  constructor(client: Client) {
    super(
      "pull",
      {
        description: "Pull from the git repo.",
        aliases: [],
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
    await msg.send("Pulling changes and compiling...");
    exec(
      "git fetch --all && git reset --hard origin/main && tsc",
      async (_, out, stderr) => {
        return await msg.send(
          `Pulled latest changes & compiled into JavaScript.`
        );
      }
    );
  }
};
