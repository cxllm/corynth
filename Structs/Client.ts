//Modules
import { Client, Collection } from "discord.js-light";
import axios from "axios";
import { readdirSync } from "fs";
import { join } from "path";
import { Db, MongoClient } from "mongodb";

//Files
import config, { Config } from "../config";
import presets = require("../presets");
import Logger from "./Logger";
import Database from "./Database";
import Util from "./Util";
import UsageEmbed from "./UsageEmbed";
//Classes for Type Defs
import Command from "./Command";
import Event from "./Event";
import Message from "./Message";
import express from "express";

export default class Corynth extends Client {
  //Files
  config: Config = config;
  presets = presets;
  UsageEmbed = UsageEmbed;

  //Modules
  web = axios;
  logs = new Logger();
  Util = new Util(this);
  server = express();

  webhooks: any = {};

  website = "corynth.xyz";
  links = {
    "invite link": "",
    "support server": "https://discord.gg/6kFbxxkX5p",
    website: `https://corynth.xyz`,
    twitter: "https://twitter.com/CorynthBot",
    "source code": "https://github.com/cxllm/corynth"
  };
  //Collections
  commands: Collection<string, Command> = new Collection<string, Command>();
  events: Collection<string, Event> = new Collection<string, Event>();
  slashes: Collection<string, Command> = new Collection<string, Command>();
  aliases: Collection<string, string> = new Collection<string, string>();

  categories: string[];

  //Database stuff
  mongo = new MongoClient(this.config.mongo, {
    useUnifiedTopology: true,
    keepAlive: true,
    useNewUrlParser: true
  });
  database: Db;
  db = {
    guilds: new Database("Guilds", "id", true),
    users: new Database("Users", "id", false)
  };

  public constructor() {
    super(config.client);
    this.handleCommands();
    this.handleDatabase();
    this.handleEvents();
    this.handleHooks();
    this.handleServer();
  }

  public async connect(): Promise<string> {
    return await this.login(this.config.token);
  }

  public handleCommands(): void {
    this.categories = readdirSync(join(__dirname, "..", "Commands"));
    this.categories.map((cat) =>
      readdirSync(join(__dirname, "..", "Commands", cat)).map((file) => {
        delete require.cache[require.resolve(`../Commands/${cat}/${file}`)];
        const cmdConstructor = require(`../Commands/${cat}/${file}`);
        const cmd: Command = new cmdConstructor(this);
        cmd.config.category = cat;
        let collection = this.commands;
        if (cmd.config.slash) collection = this.slashes;
        if (collection.has(cmd.info.name)) {
          collection.delete(cmd.info.name);
          cmd.config.aliases?.map((alias) => this.aliases.delete(alias));
        }
        collection.set(cmd.info.name, cmd);
        cmd.config.aliases?.map((alias) => this.aliases.set(alias, cmd.name));
      })
    );
  }

  private async handleDatabase(): Promise<void> {
    await this.mongo.connect();
    this.database = this.mongo.db(this.config.db);
    if ((await this.database.command({ ping: 1 })).ok === 1)
      this.logs.connection("MongoDB has connected");
    Object.keys(this.db)
      .filter((k) => k != "mongo")
      .map((k) => {
        this.db[k].init(this.database);
      });
  }

  public handleEvents(): void {
    readdirSync(join(__dirname, "..", "Events")).map((file) => {
      delete require.cache[require.resolve(`../Events/${file}`)];
      const eventConstructor = require(`../Events/${file}`);
      const event: Event = new eventConstructor(this);
      if (this.events.has(event.name)) {
        this.events.delete(event.name);
        this.events.set(event.name, event);
      } else {
        this.events.set(event.name, event);
        this[event.method](event.name, async (...args) => {
          await this.events.get(event.name).run(...args);
        });
      }
    });
  }

  public handleHooks() {
    const hooks = this.config.webhooks;
    Object.keys(hooks).map((hook) => {
      this.webhooks[hook] = this.Util.webhook(hooks[hook], true);
    });
  }

  private handleServer() {
    this.server.get("/check-alive", (_, res) => {
      res.status(200).send("OK");
    });
    this.server.get("*", (_, res) => {
      res.destroy();
    });
  }

  getVersion(): string {
    delete require.cache[require.resolve(process.cwd() + "/package.json")];
    const { version } = require(process.cwd() + "/package.json");
    return version;
  }

  getCommand(name: string): Command | undefined {
    return this.commands.get(name) || this.commands.get(this.aliases.get(name));
  }

  owner(user: string): boolean {
    return this.config.owners.includes(user);
  }
}
