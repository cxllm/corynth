import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import { GuildMember } from "discord.js-light";
export = class extends Command {
  private client: Client;
  constructor(client: Client) {
    super(
      "kick",
      {
        description: "Kick a member from your server.",
        aliases: [],
        usage: "<user> [reason]",
      },
      {
        owner: false,
        args: 1,
        permissions: {
          bot: "KICK_MEMBERS",
          user: "KICK_MEMBERS",
        },
      }
    );
    this.client = client;
  }
  async run(msg: Message) {
    let mention = this.client.Util.handleMention(msg.args[0]);
    if (!mention) return await msg.send(this.client.presets.invalid_user);
    //@ts-expect-error
    let user: GuildMember = await this.client.Util.getPunishmentUser(
      msg,
      mention,
      false
    );
    if (!user) return await msg.send(this.client.presets.invalid_user);
    if (user.id === msg.author.id)
      return await msg.send(
        `${this.client.config.emojis.cross} You can't kick yourself!`
      );
    let reason = msg.args.slice(1).join(" ") || this.client.presets.no_reason;

    if (
      (msg.member.roles.highest.position <= user.roles.highest.position ||
        user.id == msg.guild.ownerID) &&
      msg.guild.ownerID != msg.member.id
    )
      return await msg.send(
        `${this.client.config.emojis.cross} You can't kick this person because their position is equal to or greater than yours!`
      );
    if (!user.kickable)
      return await msg.send(
        `${this.client.config.emojis.cross} I can't kick this person because their position is equal to or greater than mine!`
      );

    try {
      await user.kick(reason);
      try {
        await user.send(
          `You have been kicked from ${msg.guild.name} for the reason: \`${reason}\``
        );
      } catch {}
    } catch {
      return await msg.send(
        `${this.client.config.emojis.cross} I can't kick this person because their position is equal to or greater than mine!`
      );
    }
    let embed = {
      title: "User Kicked",
      description: `The user ${user.user.tag} has been kicked for the reason: \`${reason}\``,
      color: this.client.config.colours.success,
    };
    await msg.send({ embed });
  }
};
