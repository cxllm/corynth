import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";

export = class extends Command {
  private client: Client;

  constructor(client: Client) {
    super(
      {
        name: "lastfm",
        description: "Get info from lastfm.",
        defaultPermission: true,
        options: [
          {
            name: "username",
            required: true,
            description: "The username of the user you would like info on",
            type: "STRING"
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
    let opt = msg.options[0];
    await msg.defer();
    try {
      //@ts-ignore
      let data = await this.client.Util.getLastFMUser(opt.value);
      let embed = {
        title: `Last FM Info - ${data.username}`,
        description: [
          `Name: \`${data.username}\``,
          `Total Scrobbles: \`${data.scrobbles.toLocaleString("fr")}\``,
          `Total Artists: \`${data.artists.toLocaleString("fr")}\``
        ].join("\n"),
        fields: [
          {
            name: "Recent Songs",
            value: data.recent.map(
              (song) =>
                `[${song.name}](${song.song_url}) by [${song.artist}](${song.artist_url}) - ${song.time}`
            )
          },
          {
            name: "Top Songs",
            value: data.top.map(
              (song, i) =>
                `[${song.name}](${song.song_url}) by [${song.artist}](${song.artist_url}) - ${song.scrobbles} scrobbles`
            )
          }
        ],
        color: this.client.config.colours.main,
        thumbnail: {
          url: data.avatar
        }
      };
      return msg.editReply({ embeds: [embed] });
    } catch (e) {
      console.log(e);
      await msg.editReply(`Specified user was not found`);
    }
  }
};
