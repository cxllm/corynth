import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";

export = class extends Command {
  private client: Client;

  constructor(client: Client) {
    super(
      {
        name: "ping",
        description: "View the bot's latency and response times.",
        defaultPermission: true
      },
      {
        owner: false,
        permissions: {},
        slash: false
      }
    );
    this.client = client;
  }

  async run(msg: Message) {
    const dbping = await this.client.Util.dbLatency(msg.author.id);
    return await msg.send({
      embed: {
        title: "Latency",
        description: `Client-to-Discord: ${Math.round(
          this.client.ws.ping
        )}ms\nDatabase: ${dbping}ms`,
        color: this.client.config.colours.main
      }
    });
  }
};
