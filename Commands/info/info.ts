import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";

export = class extends Command {
  private client: Client;

  constructor(client: Client) {
    super(
      {
        name: "info",
        description: "Get info from a social media platform.",
        defaultPermission: true,
        options: [
          {
            name: "github",
            type: "SUB_COMMAND_GROUP",
            description: "GitHub info for users or organisations",
            options: [
              {
                name: "user",
                type: "SUB_COMMAND",
                description: "Get a user on GitHub",
                options: [
                  {
                    name: "username",
                    type: "STRING",
                    description: "User to get info of",
                    required: true
                  }
                ]
              },
              {
                name: "organisation",
                type: "SUB_COMMAND",
                description: "Get an organisation on GitHub",
                options: [
                  {
                    name: "organisation",
                    type: "STRING",
                    description: "Organisation to get info of",
                    required: true
                  }
                ]
              }
            ]
          },
          {
            name: "minecraft",
            type: "SUB_COMMAND_GROUP",
            description: "Get info for a minecraft player or server",
            options: [
              {
                name: "user",
                type: "SUB_COMMAND",
                description: "Get info for a minecraft player",
                options: [
                  {
                    name: "username",
                    required: true,
                    description:
                      "The username of the user you would like to get",
                    type: "STRING"
                  }
                ]
              }
            ]
          },
          {
            name: "lastfm",
            type: "SUB_COMMAND",
            description: "Get a user's info on Last FM",
            options: [
              {
                name: "username",
                required: true,
                description: "The username of the user you would like info on",
                type: "STRING"
              }
            ]
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
    if (opt.name == "github") {
      opt = opt.options[0];
      if (opt.name == "user") {
        await msg.defer();
        try {
          const { data } = await this.client.web.get(
            `https://api.github.com/users/${opt.options[0].value}`
          );
          let embed = {
            title: `User Info - ${data.login}`,
            url: data.html_url,
            thumbnail: {
              url: data.avatar_url
            },
            description: [
              `Username: \`${data.login}\``,
              `Name: \`${data.name}\``,
              `Email: \`${data.email || "No Email Given"}\``,
              `Bio: \`${data.bio || "No Bio"}\``,
              `Public Repos: \`${data.public_repos}\``,
              `Followers: \`${data.followers}\``,
              `Following: \`${data.following}\``,
              `Twitter: ${
                data.twitter_username
                  ? `https://twitter.com/${data.twitter_username}`
                  : "No Twitter"
              }`,
              `Created At: \`${this.client.Util.utcDate(data.created_at)}\``
            ].join("\n"),
            color: this.client.config.colours.main,
            footer: {
              text: this.client.presets.utc
            }
          };
          await msg.editReply({ embeds: [embed] });
        } catch {
          await msg.editReply(`Specified user was not found`);
        }
      } else if (opt.name == "organisation") {
        await msg.defer();
        try {
          const { data } = await this.client.web.get(
            `https://api.github.com/orgs/${opt.options[0].value}`
          );
          let embed = {
            title: `Organisation Info - ${data.login}`,
            url: data.html_url,
            thumbnail: {
              url: data.avatar_url
            },
            description: [
              `Username: \`${data.login}\``,
              `Name: \`${data.name}\``,
              `Email: \`${data.email || "No Email Given"}\``,
              `Description: \`${data.description || "No Description"}\``,
              `Public Repos: \`${data.public_repos}\``,
              `Followers: \`${data.followers}\``,
              `Following: \`${data.following}\``,
              `Twitter: ${
                data.twitter_username
                  ? `https://twitter.com/${data.twitter_username}`
                  : "No Twitter"
              }`,
              `Created At: \`${this.client.Util.utcDate(data.created_at)}\``
            ].join("\n"),
            color: this.client.config.colours.main,
            footer: {
              text: this.client.presets.utc
            }
          };
          await msg.editReply({ embeds: [embed] });
        } catch {
          await msg.editReply(`Specified organisation was not found`);
        }
      }
    } else if (opt.name == "minecraft") {
      opt = opt.options[0];
      if (opt.name == "user") {
        await msg.defer();
        console.log(opt.options[0].value);
        const {
          data: { id }
        } = await this.client.web.get(
          `https://api.minetools.eu/uuid/${opt.options[0].value}`
        );
        if (!id) return msg.editReply(`Specified user was not found`);
        let { data } = await this.client.web.get(
          `https://api.minetools.eu/profile/${id}`
        );
        data = data.decoded;
        let embed = {
          title: `Minecraft User Info - ${data.profileName}`,
          description: [
            `Username: \`${data.profileName}\``,
            `UUID: \`${id}\``,
            `Skin: [Click Here](${data.textures.SKIN.url})`
          ].join("\n"),
          image: {
            url: data.textures.SKIN.url
          },
          color: this.client.config.colours.main
        };
        await msg.editReply({ embeds: [embed] });
      }
    } else if (opt.name == "lastfm") {
      opt = opt.options[0];
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
  }
};
