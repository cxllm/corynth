import { Collection, Message as M } from "discord.js-light";
import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
  private client: Client;
  constructor(client: Client) {
    super(
      "lyrics",
      {
        description: "Find the lyrics to a song on genius.",
        aliases: [],
        usage: "<song name>",
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
    let songs = await this.client.Util.getLyrics(msg.args.join(" "));
    songs = songs.slice(0, 5);
    let i = 1;
    let embed = {
      title: "Song Selection",
      fields: songs.map((song) => {
        song = song.result;
        return {
          name: `Result ${i++}`,
          value: `[${song.full_title}](${song.url})`,
        };
      }),
      color: this.client.config.colours.main,
      footer: {
        text: `Please select a number between 1 and ${songs.length} or type cancel to cancel.You have 10s`,
      },
    };
    await msg.send({ embed });
    let response: Collection<string, M>;
    try {
      response = await msg.channel.awaitMessages(
        (msg2) =>
          (parseInt(msg2.content) > 0 &&
            parseInt(msg2.content) <= songs.length) ||
          msg2.content.toLowerCase() === "cancel",
        {
          max: 1,
          time: 10000,
          errors: ["time"],
        }
      );
    } catch {}
    const song = songs[parseInt(response.first().content) - 1].result;
    embed = {
      title: `Lyrics: ${song.full_title} `,
      //@ts-ignore
      description: `[Lyrics to ${song.title}](${song.url})`,
      url: song.url,
      color: this.client.config.colours.main,
      thumbnail: {
        url: song.song_art_image_thumbnail_url,
      },
      footer: {
        text: "Powered by Genius Lyrics API",
      },
    };
    return await msg.send({ embed });
  }
};
