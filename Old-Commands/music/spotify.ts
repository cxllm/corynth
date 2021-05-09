import { Collection, Message as M } from "discord.js-light";
import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
  private client: Client;
  constructor(client: Client) {
    super(
      "spotify",
      {
        description: "Find info/lyrics for someone's spotify status.",
        aliases: [],
        usage: "<lyrics/info> [member]",
      },
      {
        owner: false,
        args: 1,
        permissions: {},
        cooldown: "2.5s",
      }
    );
    this.client = client;
  }
  async run(msg: Message) {
    await msg.send(`${this.client.config.emojis.loading} Loading info...`);
    let opt = msg.args.shift().toLowerCase();
    let member = await this.client.Util.getMember(msg);
    const song = this.client.Util.getSpotifyInfo(member);
    if (!song) return await msg.send(this.client.presets.no_spotify);
    let embed;
    switch (opt) {
      case "info":
        embed = {
          title: `Spotify Info: ${member.user.tag}`,
          thumbnail: {
            url: song.image,
          },
          description: `${member.user.tag} is listening to [${song.title} by ${song.artist}](${song.url})`,
          fields: [
            {
              name: "Song Info",
              value: [
                `Name: \`${song.title}\``,
                `${song.artistNumber === 1 ? "Artist" : "Artists"}: \`${
                  song.artist
                }\``,
                `Duration: \`${song.duration}\``,
                `URL: [Click Here](${song.url})`,
              ],
            },
            {
              name: `Timestamps`,
              value: [
                `Currently at: \`${song.current}\``,
                `Time Remaining: \`${song.left}\``,
                `${song.title} started at: \`${song.start}\``,
                `${song.title} will finish at: \`${song.end}\``,
              ],
            },
          ],
          color: this.client.config.colours.main,
        };
        break;
      case "lyrics":
        const s = (
          await this.client.Util.getLyrics(`${song.title} ${song.artist}`)
        )[0].result;
        if (!s) return await msg.send("Sorry, Genius couldn't find that song.");
        embed = {
          title: `Spotify Lyrics: ${song.title} by ${song.artist}`,
          description: `[Lyrics to ${song.title}](${s.url})`,
          url: s.url,
          color: this.client.config.colours.main,
          thumbnail: {
            url: song.image,
          },
          footer: {
            text: "Powered by Genius Lyrics API",
          },
        };
        break;
      default:
        embed = this.client.UsageEmbed(this);
    }
    return await msg.send("", { embed });
  }
};
