import Corynth from "./Client";
import ms from "ms";
import {
  GuildMember,
  Collection,
  User,
  WebhookClient,
  Activity,
  MessageAttachment
} from "discord.js-light";
import Message from "./Message";
import moment from "moment";
import fs, { writeFileSync } from "fs";
import { Guild } from "discord.js";
import dotenv from "dotenv";

export default class Util {
  client: Corynth;

  constructor(client: Corynth) {
    this.client = client;
  }

  async botLists() {
    await this.client.web.post(
      `https://discord.boats/api/bot/${this.client.user.id}`,
      {
        server_count: this.client.guilds.cache.size
      },
      {
        headers: {
          Authorization: this.client.config.botlists.boats,
          "Content-Type": "application/json"
        }
      }
    );
    await this.client.web
      .post(
        `https://botsfordiscord.com/api/bot/${this.client.user.id}`,
        {
          server_count: this.client.guilds.cache.size
        },
        {
          headers: {
            Authorization: this.client.config.botlists.bfd,
            "Content-Type": "application/json"
          }
        }
      )
      .catch(() => console.log("BfD failed")); //Bots for Discord
    await this.client.web
      .post(
        `https://api.infinitybotlist.com/bot/${this.client.user.id}`,
        {
          servers: this.client.guilds.cache.size
        },
        {
          headers: {
            authorization: this.client.config.botlists.infinity,
            "Content-Type": "application/json"
          }
        }
      )
      .catch((e) => {
        console.log("IBL failed"), console.log(e);
      }); //Infinity Bot List
    await this.client.web
      .post(
        `https://voidbots.net/api/auth/stats/${this.client.user.id}`,
        {
          server_count: this.client.guilds.cache.size
        },
        {
          headers: {
            Authorization: this.client.config.botlists.void,
            "Content-Type": "application/json"
          }
        }
      )
      .catch(() => console.log("Void Bots failed")); //void bots
    this.client.logs.log("Posted stats to bot lists");
  }

  checkTesting(): boolean {
    return this.client.user.id == "692779290399604766";
  }

  async dbLatency(user: string): Promise<number> {
    const original = Date.now();
    return await (async () => {
      await this.client.db.users.get(user);
      return Date.now() - original;
    })();
  }

  decode(type: any, text: string): string {
    type = type.toLowerCase();
    switch (type) {
      case "binary":
        let result = "";
        let arr = text.match(/.{1,8}/g);
        for (let i = 0; i < arr.length; i++) {
          result += String.fromCharCode(
            parseInt(parseInt(arr[i], 2).toString(10))
          );
        }
        return result;
      default:
        return Buffer.from(text, type).toString("utf-8");
    }
  }

  duration(ms: number): string {
    const sec = Math.floor((ms / 1000) % 60);
    const min = Math.floor((ms / (1000 * 60)) % 60);
    const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    let string = "";
    if (days > 0) {
      string = `${days}d, ${hrs}h, ${min}m, ${sec}s`;
    } else if (hrs > 0) {
      string = `${hrs}h, ${min}m, ${sec}s`;
    } else if (min > 0) {
      string = `${min}m, ${sec}s`;
    } else string = `${sec + "." + Math.ceil(ms % 1000).toString()}s`;
    return string;
  }

  durationAgo(milleseconds: number): string {
    return ms(milleseconds, { long: true }) + " ago";
  }

  encode(type: string, text: string): string {
    type = type.toLowerCase();
    switch (type) {
      case "binary":
        let result = "";
        for (let i = 0; i < text.length; i++) {
          let num = text[i].charCodeAt(0).toString(2);
          result += Array(8 - num.length + 1).join("0") + num;
        }
        return result;
      default:
        //@ts-ignore
        return Buffer.from(text, "utf-8").toString(type);
    }
  }

  eq(gain: number): Array<{ band: number; gain: number }> {
    let bands = [
      { band: 0, gain: -0.05 },
      { band: 1, gain: 0 },
      { band: 2, gain: 0.05 },
      { band: 3, gain: 0.1 }
    ];

    let tmp = [];

    bands.map((band) => {
      if (gain === 0) band.gain = 0;
      band.gain += gain;
      tmp.push(band);
    });

    return tmp;
  }

  /**
   *
   * @param {Message} msg
   */
  filterMentions(msg: Message, args: string[]) {
    return args.map((arg) => {
      const user = msg.mentions.users.find(
        (u) => u.id === this.handleMention(arg)
      );
      if (!user)
        return arg
          .replace("<", "")
          .replace(">", "")
          .replace("@", "")
          .replace("!", "")
          .replace("&", "");
      else return `@${user.username}`;
    });
  }

  getCovidInfo(type: "country" | "world", country?: string) {
    const info = require(`${process.cwd()}/covid-19.json`);
    if (type == "world") {
      return info.all;
    } else if (type == "country") {
      country = country.toLowerCase();
      return info.countries.find(
        (c: { country: string; countryInfo: { iso2?: string } }) =>
          country == c.country.toLowerCase() ||
          c.countryInfo.iso2?.toLowerCase() == country
      );
    }
  }

  /**
   *
   * @param {Collection} attachments The message attachments
   */
  getFirstAttachment(attachments: Collection<string, MessageAttachment>) {
    let url;
    if (attachments.first()) {
      if (attachments.first().height) url = attachments.first().url;
    } else url = null;
    return url;
  }

  async getLyrics(song: string): Promise<Array<any>> {
    let encoded = encodeURIComponent(song);
    return (
      await this.client.web.get(`https://api.genius.com/search?q=${encoded}`, {
        headers: {
          Authorization: `Bearer ${this.client.config.genius}`
        }
      })
    ).data.response.hits.filter((a) => a.type === "song");
  }

  async getMember(ctx: Message, query?: string, cache?: boolean) {
    let members = ctx.guild.members.cache;
    query = query || ctx.args.join(" ") || ctx.author.id;
    let id = this.handleMention(query);
    let out =
      members.get(id) ||
      members.find(
        (member) =>
          member.user.tag?.toLowerCase().includes(query.toLowerCase()) ||
          member.displayName?.toLowerCase().includes(query.toLowerCase())
      ) ||
      ctx.member;
    if (out.id == this.client.user.id) {
      out = ctx.guild.me;
    }
    if (
      (out === ctx.member &&
        [ctx.author.id, ctx.author.tag.toLowerCase()].includes(
          query.toLowerCase()
        )) ||
      out != ctx.member
    )
      return out;
    members = await ctx.guild.members.fetch({ cache: false });
    out =
      members.get(id) ||
      members.find(
        (member) =>
          member.user.tag?.toLowerCase().includes(query.toLowerCase()) ||
          member.displayName?.toLowerCase().includes(query.toLowerCase())
      ) ||
      ctx.member;
    if (out.id == this.client.user.id) {
      out = ctx.guild.me;
    }
    ctx.guild.members.fetch(out.id, cache ?? true);
    return out;
  }

  async getMessageImage(ctx: Message) {
    let url =
      this.getFirstAttachment(ctx.attachments) ??
      (await this.getMember(ctx)).user.displayAvatarURL({ format: "png" });
    return url;
  }

  async getOS(): Promise<string> {
    const info = await fs.promises.readFile("/etc/os-release");
    const data = dotenv.parse(info);
    return data.PRETTY_NAME;
  }

  /**
   *
   * @param {Message} msg
   * @returns {GuildMember|User}
   */
  async getPunishmentUser(
    msg: Message,
    query: string,
    u: boolean
  ): Promise<GuildMember | User> {
    let user: GuildMember | User = await this.getMember(msg, query, false);
    try {
      if ((!user || user.id === msg.author.id) && u)
        user = await this.client.users.fetch(query, false);
    } catch {
      return null;
    }
    return user;
  }

  /**
   *
   * @param {GuildMember} member
   */
  getSpotifyInfo(member: GuildMember) {
    const info: Activity = member.presence.activities.find(
      (act) => act.name === "Spotify" && act.type === "LISTENING"
    );
    if (!info) return false;
    const start = new Date(info.timestamps.start).getTime();
    const end = new Date(info.timestamps.end).getTime();
    let artistArray = info.state.split(";") || [info.state];
    let song = {
      title: info.details,
      artist: info.state.includes(";")
        ? info.state.split(";").join(",")
        : info.state,
      artistNumber: info.state.split(";").length || 1,
      start: this.utcDateShort(info.timestamps.start),
      end: this.utcDateShort(info.timestamps.end),
      //@ts-ignore
      url: `https://open.spotify.com/track/${info.syncID}`,
      image: `https://i.scdn.co/image/${
        info.assets.largeImage.split("spotify:")[1]
      }`,
      duration: this.timestamp(end - start),
      current: this.timestamp(Date.now() - new Date(start).getTime()),
      artistArray,
      left: this.timestamp(
        end - start - (Date.now() - new Date(start).getTime())
      )
    };
    return song;
  }

  handleMention(mention: string): string | undefined {
    if (mention.startsWith("<@") && mention.endsWith(">"))
      mention = mention.slice(2).replace(">", "");
    if (mention.startsWith("!")) mention = mention.slice(1);
    if (!mention.match(/(\d{17}|\d{18})/)) return undefined;
    else return mention;
  }

  memory(bytes: number, type?: string): number {
    if (type === "gb")
      return Math.round((bytes / 1024 / 1024 / 1000) * 10) / 10;
    else return Math.round((bytes / 1024 / 1024) * 100) / 100;
  }

  resolveEmoji(emoji: string): string {
    return emoji
      .replace("<", "")
      .replace(">", "")
      .replace("a:", "")
      .split(":")[2];
  }

  timestamp(ms: number): string {
    const sec = Math.floor((ms / 1000) % 60);
    const min = Math.floor((ms / (1000 * 60)) % 60);
    const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 7);
    const weeks = Math.floor(ms / (1000 * 60 * 60 * 24 * 7));

    return `${weeks ? `${weeks}w ` : ``}${days ? `${days}d ` : ``}${
      hrs ? `${hrs}h ` : ``
    }${min ? `${min}m ` : ``}${sec ? `${sec}s` : ``}`;
  }

  /**
   * Find out the total users of the client
   */
  totalUsers(): number {
    let users: number = 0;
    this.client.guilds.cache.map((guild: Guild) => {
      if (!guild.memberCount) return;
      else users += guild.memberCount;
    });
    return users;
  }

  utcDate(ms: number | Date): string {
    return moment.utc(ms).format("HH:mm:ss, dddd Do MMMM YYYY");
  }

  utcDateShort(ms: number | Date): string {
    return moment.utc(ms).format("HH:mm:ss, ddd Do MMM YYYY");
  }

  /**
   *
   * @param {String} string
   * @param {Boolean} makeClient
   */
  webhook(
    string: string,
    makeClient: boolean
  ): { id: string; token: string } | WebhookClient {
    const hook = string.split("/").slice(5);
    let info = {
      id: hook[0],
      token: hook[1]
    };
    if (makeClient) return new WebhookClient(info.id, info.token);
    return info;
  }

  async updateCovid19Info(): Promise<void> {
    const all = (
      await this.client.web.get("https://disease.sh/v3/covid-19/all")
    ).data;
    const countries = (
      await this.client.web.get("https://disease.sh/v3/covid-19/countries")
    ).data;
    const data = {
      all,
      countries
    };
    writeFileSync(`${process.cwd()}/covid-19.json`, `${JSON.stringify(data)}`);
  }
  async updateSlashCommands(): Promise<void> {
    let commands = await (this.client.Util.checkTesting()
      ? this.client.guilds.cache.get("764523835256864838").commands.fetch()
      : this.client.application.commands.fetch());
    console.log(`New Commands`);
    this.client.slashes
      .filter((cmd) => !commands.find((c) => cmd.name == c.name))
      .map(async (cmd) => {
        console.log(cmd.name);
        if (this.client.Util.checkTesting()) {
          let server = this.client.guilds.cache.get("764523835256864838");
          await server.commands.create(cmd.info);
        } else {
          await this.client.application.commands.create(cmd.info);
        }
      });
    console.log();
    console.log(`Updated Commands`);
    this.client.slashes
      .filter((cmd) => !!commands.find((c) => cmd.name == c.name))
      .map(async (cmd) => {
        console.log(cmd.name);
        let command = commands.find((c) => cmd.name == c.name);
        if (this.client.Util.checkTesting()) {
          let server = this.client.guilds.cache.get("764523835256864838");
          await server.commands.edit(command.id, cmd.info);
        } else {
          await this.client.application.commands.edit(command.id, cmd.info);
        }
      });
  }
}
