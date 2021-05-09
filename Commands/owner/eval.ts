import { inspect } from "util";
import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";

export = class extends Command {
  private client: Client;

  constructor(client: Client) {
    super(
      {
        name: "eval",
        description: "Evaluate some code."
      },
      {
        owner: true,
        args: 1,
        slash: false,
        permissions: {},
        usage: "<code>",
        aliases: ["ev", "e"]
      }
    );
    this.client = client;
  }

  async run(msg: Message) {
    const strings = [
      this.client.config.token,
      this.client.config.mongo,
      ...Object.keys(this.client.config.webhooks).map(
        (w) => this.client.config.webhooks[w]
      ) /*this.client.music.rest?.url*/
    ];
    strings.map((string) => {
      strings.push(
        string.toLowerCase(),
        string.toUpperCase(),
        string.toProperCase()
      );
    });
    let code = msg.args.join(" ");

    try {
      let evaled = await eval(code);
      const type = typeof evaled;
      if (type != "string") evaled = inspect(evaled);
      for (let string of strings) {
        evaled = evaled.replace(string, "REDACTED");
      }
      evaled = this.clean(evaled);
      const embed = {
        title: "Eval Output - Success",
        fields: [
          {
            name: "Input",
            value: `\`\`\`js\n${code.substring(0, 1015)}\`\`\``
          },
          {
            name: "Output",
            value: `\`\`\`js\n${evaled.substring(0, 1015)}\`\`\``
          },
          {
            name: "Output Type",
            value: type.toProperCase()
          }
        ],
        color: this.client.config.colours.main
      };
      msg.send({ embed });
    } catch (err) {
      const embed = {
        title: "Eval Output - Error",
        fields: [
          {
            name: "Input",
            value: `\`\`\`js\n${code.substring(0, 1015)}\`\`\``
          },
          {
            name: "Error",
            value: `\`\`\`js\n${err.toString().substring(0, 1015)}\`\`\``
          }
        ],
        color: this.client.config.colours.error
      };
      console.log(err);
      msg.send({ embed });
    }
  }

  clean(text: string) {
    if (typeof text === "string")
      return text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
  }
};
