import Event from "../Structs/Event";
import Client from "../Structs/Client";
import CommandInteraction from "../Structs/CommandInteraction";
import permissions from "../permissions";
import ms from "ms";

export = class extends Event {
  constructor(client: Client) {
    super(client, "interaction", "on");
  }

  async run(msg: CommandInteraction) {
    if (!msg.isCommand()) return;
    const command = this.client.slashes.get(msg.commandName);
    if (!command) return;
    if (!command.config.slash) return;
    if (command.config.guild && !msg.guildID) {
      return msg.reply(
        "This command can't be run in DMs. Please re-run this command in a server."
      );
    }
    if (msg.guildID) {
      let guild = await this.client.db.guilds.get(msg.guild.id);
      if (!guild) {
        guild = {
          prefix: this.client.config.prefix
        };
        this.client.db.guilds.set(msg.guild.id, guild);
      }
      msg.db = guild;
    }
    if (
      command.config.permissions.user &&
      !msg.member.permissions.has(command.config.permissions.user) &&
      !this.client.owner(msg.user.id)
    )
      return await msg.reply({
        embeds: [
          {
            description: `${
              this.client.config.emojis.cross
            } You don't have the required permission to run \`${
              command.name
            }\`, you need the \`${
              permissions[command.config.permissions.user]
            }\` permission.`,
            color: this.client.config.colours.error
          }
        ],
        ephemeral: true
      });
    if (
      command.config.permissions.bot &&
      !msg.guild.me.permissions.has(command.config.permissions.bot)
    )
      return await msg.reply({
        embeds: [
          {
            description: `${
              this.client.config.emojis.cross
            } I don't have the required permission to run \`${
              command.name
            }\`, I need the \`${
              permissions[command.config.permissions.bot]
            }\` permission.`,
            color: this.client.config.colours.error
          }
        ],
        ephemeral: true
      });
    if (command.config.cooldown && !this.client.owner(msg.user.id)) {
      let user = await this.client.db.users.get(msg.user.id);
      if (!user)
        user = {
          id: msg.user.id,
          cooldown: []
        };
      const cooldown = user.cooldown.filter((c) => c.name == command.name)[0];
      if (cooldown) {
        if (Date.now() > cooldown.end) {
          user.cooldown.splice(user.cooldown.indexOf(cooldown), 1);
        } else
          return msg.reply(
            `The command ${command.name} has a ${
              command.config.cooldown
            } cooldown. Please wait ${this.client.Util.duration(
              cooldown.end - Date.now()
            )} before using the command again.`,
            { ephemeral: true }
          );
      }
      user.cooldown.push({
        name: command.name,
        end: Date.now() + ms(command.config.cooldown)
      });
      await this.client.db.users.set(msg.user.id, user);
    }
    try {
      return await command.run(msg);
    } catch (e) {
      let content = {
        embeds: [
          {
            title: "Sorry, an error occured",
            description: `An error occured while running the ${command.name} command.\nThis has been reported to the developer`,
            color: this.client.config.colours.error,
            fields: [
              {
                name: "Details",
                value: "```js\n" + e + "```"
              }
            ]
          }
        ],
        ephemeral: true
      };
      try {
        await msg.reply(content);
      } catch {
        await msg.editReply(content);
      }

      let err = {
        title: "An Error Occured",
        description: `An error occured while running the ${command.name} command.`,
        fields: [
          {
            name: "Details",
            value: [
              `User: ${msg.user.tag}`,
              `Content: /${command.name} ${msg.options
                .map(
                  (opt) =>
                    `${opt.value} ${
                      opt.type == "SUB_COMMAND" && opt.options
                        ? opt.options.map((opt) => opt.value)
                        : ""
                    }`
                )
                .join(" ")}`
            ]
          },
          {
            name: "Error",
            value: "```js\n" + e + "```"
          }
        ],
        color: this.client.config.colours.error
      };
      await this.client.webhooks.errors.send({
        username: `Error`,
        avatarURL: this.client.user.avatarURL(),
        embeds: [err]
      });
    }
  }
};
