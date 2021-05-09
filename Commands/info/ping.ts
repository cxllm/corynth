import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";

export = class extends Command {
  private client: Client;

  constructor(client: Client) {
    super(
      {
        name: "ping",
        description: "View the bot's latency and response times.",
        defaultPermission: true,
        options: [
          {
            name: "type",
            type: "STRING",
            description: "Type of ping to get",
            required: true,
            choices: [
              {
                name: "Database",
                value: "database"
              },
              {
                name: "API",
                value: "heartbeat"
              }
            ]
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
    const content = `{ping} Latency: {value}ms`;
    if (msg.options[0].value == "database") {
      const ping = await this.client.Util.dbLatency(msg.user.id);
      return await msg.reply(
        content
          .replace("{ping}", "Database")
          .replace("{value}", ping.toString())
      );
    } else if (msg.options[0].value == "heartbeat") {
      return await msg.reply(
        content
          .replace("{ping}", "Client To Discord")
          .replace("{value}", this.client.ws.ping.toString())
      );
    }
  }
};
