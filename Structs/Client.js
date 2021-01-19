const { Client, Collection } = require("discord.js-light"),
    config = require("../config"),
    Logger = require("./Logger"),
    { readdirSync } = require("fs"),
    { join } = require("path"),
    Util = require("./Util"),
    guildInfo = require("../guildInfo"),
    presets = require("../presets"),
    UsageEmbed = require("./UsageEmbed"),
    { Shoukaku } = require("shoukaku"),
    { MongoClient } = require("mongodb"),
    Model = require("./Model"),
    canvacord = require("canvacord");

module.exports = class Corynth extends Client {
    config = config;
    website = "corynth.xyz";
    axios = require("axios").default;
    Util = new Util(this);
    presets = presets;
    logger = new Logger();
    canva = canvacord.Canvas
    UsageEmbed = UsageEmbed;
    covid = {
        all: {},
        countries: []
    }
    guildInfo = guildInfo;
    aliases = new Collection();
    commands = new Collection();
    events = new Collection();
    responses = new Collection();
    queue = new Collection();
    links = {
        "invite link": "",
        "support server": "https://discord.gg/v9Z5nzGaRw",
        "website": `https://${this.website}`,
        "donate": "https://paypal.me/cx11m"
    }
    vote = {
        "top.gg": "https://top.gg/bot/660818351638970370",
        "Bots For Discord": "https://botsfordiscord.com/bot/660818351638970370",
        "Infinity Bot List": "https://infinitybotlist.com/bots/660818351638970370",
        "Void Bots": "https://voidbots.net/bot/660818351638970370"
    }
    webhooks = {}
    db = {
        mongo: new MongoClient(this.config.mongo, { useUnifiedTopology: true }),
        Guilds: new Model("Guilds", "id", true),
        Users: new Model("Users", "id", false)
    }
    constructor() {
        super(config.client);
        this.musicHandler = new Shoukaku(this, this.config.nodes, {
            moveOnDisconnect: false,
            resumable: false,
            resumableTimeout: 30,
            reconnectTries: 10,
            restTimeout: 10000
        });
        this.musicHandler.on('ready', async (name) => {
            this.music = this.musicHandler.getNode("main");
            this.logger.connection(`Node ${name} has connected`)
        });
        this.musicHandler.on('error', (name, error) => this.logger.error(`Node ${name} encountered an error: ${error}`));
        this.handle()
    }
    async connect() {
        await this.login(this.config.token)
    }
    async handleDB() {
        await this.db.mongo.connect()
        this.database = this.db.mongo.db(this.config.db);
        if ((await this.database.command({ ping: 1 })).ok === 1) this.logger.connection("MongoDB has connected")
        this.database.on("timeout", () => this.logger.connection("MongoDB has timed out"))
        Object.keys(this.db).filter(k => k != "mongo").map(k => {
            this.db[k].init(this.database)
            this.db[k].events.on("cacheSweep", () => this.logger.log(`Cache cleared on Collection ${k}`))
        })
    }
    getCommand(cmd) {
        return this.commands.get(cmd) || this.commands.get(this.aliases.get(cmd));
    }
    async handle() {
        this.handleCommands()
        this.handleDB()
        this.handleEvents()
        this.handleHooks()
    }

    handleCommands() {
        this.categories = readdirSync(join(__dirname, "..", "Commands"));
        this.categories.map(cat => {
            readdirSync(join(__dirname, "..", "Commands", cat)).filter(file => file.endsWith(".js")).map(file => {
                delete require.cache[require.resolve(`../Commands/${cat}/${file}`)]

                const cmd = new (require(`../Commands/${cat}/${file}`));
                cmd.config.category = cat;
                if (this.commands.has(cmd.name)) {
                    this.commands.delete(cmd.name);
                    cmd.help.aliases.map(alias => this.aliases.delete(alias))
                }
                this.commands.set(cmd.name, cmd);
                cmd.help.aliases.map(alias => this.aliases.set(alias, cmd.name));
            })
        });
        this.readyTimestamp ? null : this.logger.log(`Loaded ${this.commands.size} commands`)
    }
    handleEvents() {
        readdirSync(join(__dirname, "..", "Events")).filter(file => file.endsWith(".js")).map(eventName => {
            delete require.cache[require.resolve(`../Events/${eventName}`)]
            const event = new (require(`../Events/${eventName}`))();
            if (this.events.has(event.name)) {
                this.events.delete(event.name);
                this.events.set(event.name, event)
            } else {
                this.events.set(event.name, event);
                if (event.prop) {
                    this[event.prop][event.method](event.name, (...args) => {
                        const eventFunc = this.events.get(event.name)
                        eventFunc.run(this, ...args)
                    })
                } else {
                    this[event.method](event.name, (...args) => {
                        const eventFunc = this.events.get(event.name)
                        eventFunc.run(this, ...args)
                    })
                }
            }
        })
        this.readyTimestamp ? null : this.logger.log(`Loaded ${this.events.size} events`)

    }
    handleHooks() {
        const hooks = this.config.webhooks;
        Object.keys(hooks).map(hook => {
            this.webhooks[hook] = this.Util.webhook(hooks[hook], true)
        });
        this.logger.log(`Loaded ${Object.keys(this.webhooks).length} webhooks`)
    }
}