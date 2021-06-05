import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import permissions from "../../permissions";

export = class extends Command {
  private client: Client;

  constructor(client: Client) {
    super(
      {
        description: "Help and advice about the bot.",
        name: "help"
      },
      {
        owner: false,
        permissions: {},
        slash: false,
        usage: "[command]",
        aliases: ["info", "commands", "cmds"]
      }
    );
    this.client = client;
  }

  async run(msg: Message) {
    if (!msg.args[0]) {
      let categories = this.client.categories.filter((cat) => cat != "owner");
      if (this.client.owner(msg.author.id)) categories = this.client.categories;
      await msg.send({
        embed: {
          title: "Help Menu",
          description: `Most of Corynth's commands are now done through slash commands.If you type \`/\` on your menu, you should be able to see Corynth's commands. 
					If you do not see Corynth's commands listed or an icon with Corynth's logo, please re-invite Corynth using [this link](${
            this.client.links["invite link"]
          })
					Below you can find Corynth's normal, non-slash commands, and if you run \`${
            msg.db.prefix
          }help <command name>\`, you can find info on a specific command.
					Total Non-Slash Commands: ${
            this.client.owner(msg.author.id)
              ? this.client.commands.size
              : this.client.commands.filter(
                  (cmd) => cmd.config.category != "owner"
                ).size
          }`,
          color: this.client.config.colours.main,
          fields: [
            ...categories.map((cat) => {
              const cmds = this.getCatCommands(cat);
              return {
                name: `${cat.toProperCase()} [${cmds.size}] `,
                value:
                  cmds.map((cmd) => `\`${cmd.name}\``).join(", ") ||
                  "No normal commands"
              };
            }),
            {
              name: "Links",
              value: Object.keys(this.client.links)
                .map(
                  (link) =>
                    `[${link.toProperCase()}](${this.client.links[link]})`
                )
                .join(" | ")
            }
          ]
        }
      });
    } else {
      const command = this.client.getCommand(msg.args[0].toLowerCase());
      if (
        !command ||
        (command.config.owner && !this.client.owner(msg.author.id))
      )
        return await msg.send(`The command \`${msg.args[0]}\` was not found`);
      if (command.config.slash)
        return await msg.send(
          `The command \`${command.name}\` is a slash command`
        );
      return await msg.send({
        embed: {
          title: `Command Info - ${command.name.toProperCase()}`,
          description: command.info.description,
          fields: [
            {
              name: "Information",
              value: [
                `Usage: \`${command.name}${
                  command.config.usage ? ` ${command.config.usage}` : ``
                }\``,
                `Required Args: \`${command.config.args || 0}\``,
                `Cooldown: \`${command.config.cooldown || "No Cooldown"}\``,
                `Category: \`${command.config.category.toProperCase()}\``
              ]
            },
            {
              name: "Permissions Needed",
              value: [
                `Permissions needed for the User: \`${
                  permissions[command.config.permissions.user] || "None"
                }\``,
                `Permissions needed for the Bot: \`${
                  permissions[command.config.permissions.bot] || "None"
                }\``
              ]
            }
          ],
          color: this.client.config.colours.main,
          footer: {
            text: `Usage: <> is required and [] is optional`
          }
        }
      });
    }
  }

  getCatCommands(category: string) {
    return this.client.commands.filter(
      (command) => command.config.category == category
    );
  }
};
