import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { User } from "discord.js-light";
export = class extends Command {
  private client: Client;
  constructor(client: Client) {
    super(
      "unban",
      {
        description: "Unban a banned user.",
        aliases: [],
        usage: "<user> [reason]",
      },
      {
        owner: false,
        args: 1,
        permissions: {
          bot: "BAN_MEMBERS",
          user: "BAN_MEMBERS",
        },
      }
    );
    this.client = client;
  }
  async run(msg: Message) {
    let mention = this.client.Util.handleMention(msg.args[0]);
    let user: User;
    try {
      user = await this.client.users.fetch(mention, false);
    } catch {
      return await msg.send(this.client.presets.invalid_user);
    }
    if (!user) return await msg.send(this.client.presets.invalid_user);
    if (user.id === msg.author.id)
      return await msg.send(
        `${this.client.config.emojis.cross} You can't unban yourself!`
      );
    let reason = msg.args.slice(1).join(" ") || this.client.presets.no_reason;
    try {
      await msg.guild.fetchBan(user);
    } catch {
      return await msg.send(`This user is not banned!`);
    }
    await msg.guild.members.unban(user.id, reason);
    let embed = {
      title: "User Unbanned",
      description: `The user ${user.tag} has been unbanned for the reason: \`${reason}\``,
      color: this.client.config.colours.success,
    };
    await msg.send({ embed });
  }
};
