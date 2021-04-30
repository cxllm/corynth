import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
  private client: Client;
  constructor(client: Client) {
    super(
      "ping",
      {
        description: "View the bot's latency and response times.",
        aliases: ["latency", "response-time"],
        usage: "",
      },
      {
        owner: false,
        args: 0,
        permissions: {},
      }
    );
    this.client = client;
  }
  async run(msg: Message) {
    const m = await msg.send("Testing Latency");
    const latency = m.createdTimestamp - msg.createdTimestamp;
    await msg.send("", {
      embed: {
        title: "Bot Latency",
        description: `Message Response Time: \`${latency}ms\`\nDiscord API Heartbeat: \`${this.client.ws.ping}ms\``,
        color: this.client.config.colours.main,
      },
    });
  }
};
