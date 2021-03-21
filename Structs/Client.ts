//Modules
import Discord, { Client, Collection, DMChannel, NewsChannel, TextChannel, VoiceChannel, WebhookClient } from "discord.js-light";
//@ts-ignore
Discord.version = "12";
import axios from "axios"
import { readdirSync } from "fs";
import { join } from "path";
import { Db, MongoClient } from "mongodb";
const canvacord = require("canvacord"); //Module doesn't include typings

//Files
import config, { Config } from "../config";
import presets from "../presets";
import permissions from "../permissions";
import Logger from "./Logger"
import Database from "./Database";
import Util from "./Util";
import UsageEmbed from "./UsageEmbed";
//Classes for Type Defs
import Command from "./Command";
import Event from "./Event";
import { Shoukaku, ShoukakuPlayer, ShoukakuSocket } from "shoukaku";
import Message from "./Message";
import Track from "./Track";

export default class Corynth extends Client {
    //Files
    config: Config = config;
    presets = presets;
    UsageEmbed = UsageEmbed;
    permissions = permissions;

    //Modules
    web = axios;
    logs = new Logger();
    Util = new Util(this);
    canva = canvacord.Canvas

    webhooks: {
        connections?: WebhookClient;
        guilds?: WebhookClient;
        errors?: WebhookClient;
    } = {}

    website = "corynth.xyz";
    links = {
        "invite link": "",
        "support server": "https://discord.gg/6kFbxxkX5p",
        "website": `https://${this.website}`,
        "donate": "https://paypal.me/cx11m"
    }
    //Collections
    commands: Collection<string, Command> = new Collection();
    events: Collection<string, Event> = new Collection();
    aliases: Collection<string, string> = new Collection();
    queue: Collection<string, {
        text: TextChannel | DMChannel | NewsChannel,
        voice: VoiceChannel,
        player: ShoukakuPlayer,
        songs: Track[],
        loop: number,
        npmsg: Message,
        thumbnail: string,
        filters: {
            volume?: number,
            bassboost?: number,
            equalizer?: Array<any>,
            karaoke?: {
                level: number
            },
            timescale?: {
                pitch?: number,
                speed?: number
            }
        },
        timedout?: boolean
    }> = new Collection();

    categories: string[];

    //Database stuff
    mongo = new MongoClient(this.config.mongo, { useUnifiedTopology: true, keepAlive: true, useNewUrlParser: true });
    database: Db;
    db = {
        guilds: new Database("guilds", "id", true),
        users: new Database("users", "id", false)
    }
    music: ShoukakuSocket;

    public constructor() {
        super(config.client);
        const shoukaku = new Shoukaku(this, this.config.nodes, {
            moveOnDisconnect: true,
            resumable: false,
            resumableTimeout: 30,
            reconnectTries: 10,
            restTimeout: 10000
        });
        shoukaku.on('ready', async (name) => {
            this.music = shoukaku.getNode("main");
            this.logs.connection(`Node "${name}" has connected`)
        });
        shoukaku.on('error', (name, error) => this.logs.error(`Node ${name} encountered an error: ${error}`));
        this.handleCommands();
        this.handleDatabase();
        this.handleEvents();
        this.handleHooks();
    }
    public async connect(): Promise<string> {
        return await this.login(this.config.token);
    }
    public handleCommands(): void {
        this.categories = readdirSync(join(__dirname, "..", "Commands"));
        this.categories.map(cat =>
            readdirSync(join(__dirname, "..", "Commands", cat)).map(file => {
                delete require.cache[require.resolve(`../Commands/${cat}/${file}`)]
                const cmdConstructor = require(`../Commands/${cat}/${file}`);
                const cmd: Command = new cmdConstructor(this);
                cmd.info.category = cat;
                if (this.commands.has(cmd.name)) {
                    this.commands.delete(cmd.name);
                    cmd.info.aliases.map(alias => this.aliases.delete(alias))
                }
                this.commands.set(cmd.name, cmd);
                cmd.info.aliases.map(alias => this.aliases.set(alias, cmd.name));
            })
        )
    }

    private async handleDatabase(): Promise<void> {
        await this.mongo.connect();
        this.database = this.mongo.db(this.config.db);
        if ((await this.database.command({ ping: 1 })).ok === 1) this.logs.connection("MongoDB has connected");
        Object.keys(this.db).filter(k => k != "mongo").map(k => {
            this.db[k].init(this.database);
        });
    }

    public handleEvents(): void {
        readdirSync(join(__dirname, "..", "Events")).map(file => {
            delete require.cache[require.resolve(`../Events/${file}`)]
            const eventConstructor = require(`../Events/${file}`);
            const event: Event = new eventConstructor(this);
            if (this.events.has(event.name)) {
                this.events.delete(event.name);
                this.events.set(event.name, event)
            } else {
                this.events.set(event.name, event)
                this[event.method](event.name, async (...args) => {
                    this.events.get(event.name).run(...args);
                })
            }
        })
    }
    public handleHooks() {
        const hooks = this.config.webhooks;
        Object.keys(hooks).map(hook => {
            this.webhooks[hook] = this.Util.webhook(hooks[hook], true)
        });
    }
    getCommand(name: string): Command | undefined {
        return this.commands.get(name) || this.commands.get(this.aliases.get(name));
    }

    owner(user: string): boolean {
        return this.config.owners.includes(user);
    }
}