"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Modules
const discord_js_light_1 = __importStar(require("discord.js-light"));
//@ts-ignore
discord_js_light_1.default.version = "12";
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const path_1 = require("path");
const mongodb_1 = require("mongodb");
//Files
const config_1 = __importDefault(require("../config"));
const presets_1 = __importDefault(require("../presets"));
const permissions_1 = __importDefault(require("../permissions"));
const Logger_1 = __importDefault(require("./Logger"));
const Database_1 = __importDefault(require("./Database"));
const Util_1 = __importDefault(require("./Util"));
const UsageEmbed_1 = __importDefault(require("./UsageEmbed"));
const shoukaku_1 = require("shoukaku");
class Corynth extends discord_js_light_1.Client {
    constructor() {
        super(config_1.default.client);
        //Files
        this.config = config_1.default;
        this.presets = presets_1.default;
        this.UsageEmbed = UsageEmbed_1.default;
        this.permissions = permissions_1.default;
        //Modules
        this.web = axios_1.default;
        this.logs = new Logger_1.default();
        this.Util = new Util_1.default(this);
        this.webhooks = {};
        this.website = "corynth.xyz";
        this.links = {
            "invite link": "",
            "support server": "https://discord.gg/6kFbxxkX5p",
            "website": `https://${this.website}`,
            "donate": "https://paypal.me/cx11m"
        };
        //Collections
        this.commands = new discord_js_light_1.Collection();
        this.events = new discord_js_light_1.Collection();
        this.aliases = new discord_js_light_1.Collection();
        this.queue = new discord_js_light_1.Collection();
        //Database stuff
        this.mongo = new mongodb_1.MongoClient(this.config.mongo, { useUnifiedTopology: true, keepAlive: true, useNewUrlParser: true });
        this.db = {
            guilds: new Database_1.default("guilds", "id", true),
            users: new Database_1.default("users", "id", false)
        };
        const shoukaku = new shoukaku_1.Shoukaku(this, this.config.nodes, {
            moveOnDisconnect: true,
            resumable: false,
            resumableTimeout: 30,
            reconnectTries: 10,
            restTimeout: 10000
        });
        shoukaku.on('ready', async (name) => {
            this.music = shoukaku.getNode("main");
            this.logs.connection(`Node "${name}" has connected`);
        });
        shoukaku.on('error', (name, error) => this.logs.error(`Node ${name} encountered an error: ${error}`));
        this.handleCommands();
        this.handleDatabase();
        this.handleEvents();
        this.handleHooks();
    }
    async connect() {
        return await this.login(this.config.token);
    }
    handleCommands() {
        this.categories = fs_1.readdirSync(path_1.join(__dirname, "..", "Commands"));
        this.categories.map(cat => fs_1.readdirSync(path_1.join(__dirname, "..", "Commands", cat)).map(file => {
            delete require.cache[require.resolve(`../Commands/${cat}/${file}`)];
            const cmdConstructor = require(`../Commands/${cat}/${file}`);
            const cmd = new cmdConstructor(this);
            cmd.info.category = cat;
            if (this.commands.has(cmd.name)) {
                this.commands.delete(cmd.name);
                cmd.info.aliases.map(alias => this.aliases.delete(alias));
            }
            this.commands.set(cmd.name, cmd);
            cmd.info.aliases.map(alias => this.aliases.set(alias, cmd.name));
        }));
    }
    async handleDatabase() {
        await this.mongo.connect();
        this.database = this.mongo.db(this.config.db);
        if ((await this.database.command({ ping: 1 })).ok === 1)
            this.logs.connection("MongoDB has connected");
        Object.keys(this.db).filter(k => k != "mongo").map(k => {
            this.db[k].init(this.database);
        });
    }
    handleEvents() {
        fs_1.readdirSync(path_1.join(__dirname, "..", "Events")).map(file => {
            delete require.cache[require.resolve(`../Events/${file}`)];
            const eventConstructor = require(`../Events/${file}`);
            const event = new eventConstructor(this);
            if (this.events.has(event.name)) {
                this.events.delete(event.name);
                this.events.set(event.name, event);
            }
            else {
                this.events.set(event.name, event);
                this[event.method](event.name, async (...args) => {
                    this.events.get(event.name).run(...args);
                });
            }
        });
    }
    handleHooks() {
        const hooks = this.config.webhooks;
        Object.keys(hooks).map(hook => {
            this.webhooks[hook] = this.Util.webhook(hooks[hook], true);
        });
    }
    getCommand(name) {
        return this.commands.get(name) || this.commands.get(this.aliases.get(name));
    }
    owner(user) {
        return this.config.owners.includes(user);
    }
}
exports.default = Corynth;
