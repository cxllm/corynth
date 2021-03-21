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
const ms_1 = __importDefault(require("ms"));
const discord_js_light_1 = require("discord.js-light");
const moment_1 = __importDefault(require("moment"));
const fs_1 = __importStar(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
class Util {
    constructor(client) {
        this.client = client;
    }
    async botLists() {
        await this.client.web.post(`https://top.gg/api/bots/${this.client.user.id}/stats`, {
            server_count: this.client.guilds.cache.size
        }, {
            headers: {
                Authorization: this.client.config.botlists.top_gg,
                'Content-Type': 'application/json'
            }
        }).catch(() => console.log("Top.gg failed"));
        await this.client.web.post(`https://botsfordiscord.com/api/bot/${this.client.user.id}`, {
            server_count: this.client.guilds.cache.size
        }, {
            headers: {
                Authorization: this.client.config.botlists.bfd,
                'Content-Type': 'application/json'
            }
        }).catch(() => console.log("BfD failed")); //Bots for Discord
        await this.client.web.post(`https://api.infinitybotlist.com/bot/${this.client.user.id}`, {
            servers: this.client.guilds.cache.size
        }, {
            headers: {
                authorization: this.client.config.botlists.infinity,
                'Content-Type': 'application/json'
            },
        }).catch(() => console.log("IBL failed")); //Infinity Bot List
        await this.client.web.post(`https://voidbots.net/api/auth/stats/${this.client.user.id}`, {
            server_count: this.client.guilds.cache.size
        }, {
            headers: {
                Authorization: this.client.config.botlists.void,
                'Content-Type': 'application/json'
            }
        }).catch(() => console.log("Void Bots failed")); //void bots
        this.client.logs.log("Posted stats to bot lists");
    }
    canPunish(punished, punisher) {
        if (punisher.roles.highest.rawPosition <= punished.roles.highest.rawPosition || punished.guild.ownerID === punished.id)
            return false;
        return true;
    }
    ;
    dbLatency({ guild, author }, cache) {
        const original = Date.now();
        return cache ? (() => {
            this.client.db.guilds.get(guild.id);
            return Date.now() - original;
        })() : new Promise((resolve) => resolve(this.client.db.users.get(author.id))).then(() => Date.now() - original);
    }
    decode(type, text) {
        type = type.toLowerCase();
        switch (type) {
            case "binary":
                let result = "";
                let arr = text.match(/.{1,8}/g);
                for (let i = 0; i < arr.length; i++) {
                    result += String.fromCharCode(parseInt(parseInt(arr[i], 2).toString(10)));
                }
                return result;
            default:
                return Buffer.from(text, type).toString("utf-8");
        }
    }
    duration(ms) {
        const sec = Math.floor((ms / 1000) % 60);
        const min = Math.floor((ms / (1000 * 60)) % 60);
        const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const days = Math.floor((ms / (1000 * 60 * 60 * 24)));
        let string = '';
        if (days > 0) {
            string = `${days}d, ${hrs}h, ${min}m, ${sec}s`;
        }
        else if (hrs > 0) {
            string = `${hrs}h, ${min}m, ${sec}s`;
        }
        else if (min > 0) {
            string = `${min}m, ${sec}s`;
        }
        else
            string = `${sec + "." + Math.ceil(ms % 1000).toString()}s`;
        return string;
    }
    durationAgo(milleseconds) {
        return ms_1.default(milleseconds, { long: true }) + " ago";
    }
    encode(type, text) {
        type = type.toLowerCase();
        switch (type) {
            case "binary":
                let result = "";
                for (let i = 0; i < text.length; i++) {
                    let num = text[i].charCodeAt(0).toString(2);
                    result += Array(8 - num.length + 1).join("0") + num;
                }
                return result;
            case "hex":
            case "base64":
                return Buffer.from(text, "utf-8").toString(type);
            default:
                return;
        }
    }
    eq(gain) {
        let bands = [
            { "band": 0, "gain": -0.05 },
            { "band": 1, "gain": 0 },
            { "band": 2, "gain": 0.05 },
            { "band": 3, "gain": 0.1 }
        ];
        let tmp = [];
        bands.map(band => {
            if (gain === 0)
                band.gain = 0;
            band.gain += gain;
            tmp.push(band);
        });
        return tmp;
    }
    /**
     *
     * @param {Message} msg
     */
    filterMentions(msg, args) {
        return args.map(arg => {
            const user = msg.mentions.users.find(u => u.id === this.handleMention(arg));
            if (!user)
                return arg.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace("&", "");
            else
                return `@​​​​​​​​​​​​​​​​​${user.username}`;
        });
    }
    getCovidInfo(type, country) {
        const info = require("../covid-19.json");
        if (type == "world") {
            return info.all;
        }
        else if (type == "country") {
            country = country.toLowerCase();
            return info.countries.find((c) => { var _a; return country == c.country.toLowerCase() || ((_a = c.countryInfo.iso2) === null || _a === void 0 ? void 0 : _a.toLowerCase()) == country; });
        }
    }
    /**
     *
     * @param {Collection} attachments The message attachments
     */
    getFirstAttachment(attachments) {
        let url;
        if (attachments.first()) {
            if (attachments.first().height)
                url = attachments.first().url;
        }
        else
            url = null;
        return url;
    }
    async getLyrics(song) {
        let encoded = encodeURIComponent(song);
        return (await this.client.web.get(`https://api.genius.com/search?q=${encoded}`, {
            headers: {
                Authorization: `Bearer ${this.client.config.genius}`
            }
        })).data.response.hits.filter(a => a.type === 'song');
    }
    async getMember(ctx, query, cache) {
        let members = ctx.guild.members.cache;
        query = query || ctx.args.join(" ") || ctx.author.id;
        let id = this.handleMention(query);
        let out = members.get(id) ||
            members.find(member => { var _a, _b; return ((_a = member.user.tag) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(query.toLowerCase())) || ((_b = member.displayName) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(query.toLowerCase())); })
            || ctx.member;
        if ((out === ctx.member && [ctx.author.id, ctx.author.tag,].includes(query)) || out != ctx.member)
            return out;
        members = await ctx.guild.members.fetch({ cache: false });
        out = members.get(id) ||
            members.find(member => { var _a; return member.user.tag.toLowerCase().includes(query.toLowerCase()) || ((_a = member.displayName) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(query.toLowerCase())); }) ||
            ctx.member;
        ctx.guild.members.fetch(out.id, cache !== null && cache !== void 0 ? cache : true);
        return out;
    }
    async getMessageImage(ctx) {
        var _a;
        let url = (_a = this.getFirstAttachment(ctx.attachments)) !== null && _a !== void 0 ? _a : (await this.getMember(ctx)).user.displayAvatarURL({ format: "png" });
        return url;
    }
    async getOS() {
        const info = await fs_1.default.promises.readFile("/etc/os-release");
        const data = dotenv_1.default.parse(info);
        return data.PRETTY_NAME;
    }
    /**
    *
    * @param {Message} msg
    * @returns {GuildMember|User}
    */
    async getPunishmentUser(msg, query) {
        let user = await this.getMember(msg, query, false);
        try {
            if (!user || user.id === msg.author.id)
                user = await this.client.users.fetch(query, false);
        }
        catch {
            return null;
        }
        return user;
    }
    /**
     *
     * @param {GuildMember} member
     */
    getSpotifyInfo(member) {
        const info = member.presence.activities.find(act => act.name === "Spotify" && act.type === "LISTENING");
        if (!info)
            return false;
        const start = new Date(info.timestamps.start).getTime();
        const end = new Date(info.timestamps.end).getTime();
        let artistArray = info.state.split(";") || [info.state];
        let song = {
            title: info.details,
            artist: info.state.includes(";") ? info.state.split(";").join(",") : info.state,
            artistNumber: info.state.split(";").length || 1,
            start: this.utcDateShort(info.timestamps.start),
            end: this.utcDateShort(info.timestamps.end),
            //@ts-ignore
            url: `https://open.spotify.com/track/${info.syncID}`,
            image: `https://i.scdn.co/image/${info.assets.largeImage.split("spotify:")[1]}`,
            duration: this.timestamp(end - start),
            current: this.timestamp(Date.now() - new Date(start).getTime()),
            artistArray,
            left: this.timestamp((end - start) - (Date.now() - new Date(start).getTime()))
        };
        return song;
    }
    handleMention(mention) {
        if (mention.startsWith("<@") && mention.endsWith(">"))
            mention = mention.slice(2).replace(">", "");
        if (mention.startsWith("!"))
            mention = mention.slice(1);
        if (!mention.match(/(\d{17}|\d{18})/))
            return undefined;
        else
            return mention;
    }
    memory(bytes, type) {
        if (type === "gb")
            return Math.round(bytes / 1024 / 1024 / 1000 * 10) / 10;
        else
            return Math.round(bytes / 1024 / 1024 * 100) / 100;
    }
    resolveEmoji(emoji) {
        return emoji.replace("<", "").replace(">", "").replace("a:", "").split(":")[2];
    }
    timestamp(ms) {
        const sec = Math.floor((ms / 1000) % 60);
        const min = Math.floor((ms / (1000 * 60)) % 60);
        const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 7);
        const weeks = Math.floor((ms / (1000 * 60 * 60 * 24 * 7)));
        return `${weeks ? `${weeks}w ` : ``}${days ? `${days}d ` : ``}${hrs ? `${hrs}h ` : ``}${min ? `${min}m ` : ``}${sec ? `${sec}s` : ``}`;
    }
    tokenPush() {
        require("child_process").exec(`cd ${process.cwd()}/Tokens && git add . && git commit -m "Automatic Token Leak Push" && git push -f && git rm --cached Token* && rm -rf Token-*`);
    }
    tokenTester(token) {
        return token.match(/[MNO][A-Za-z\d]{23}.[\w-]{6}.[\w-]{27}/g);
    }
    /**
     * Find out the total users of the client
     */
    totalUsers() {
        let users = 0;
        this.client.guilds.cache.map((guild) => {
            if (!guild.memberCount)
                return;
            else
                users += guild.memberCount;
        });
        return users;
    }
    utcDate(ms) {
        return moment_1.default.utc(ms).format("HH:mm:ss, dddd Do MMMM YYYY");
    }
    utcDateShort(ms) {
        return moment_1.default.utc(ms).format("HH:mm:ss, ddd Do MMM YYYY");
    }
    /**
     *
     * @param {String} string
     * @param {Boolean} makeClient
     */
    webhook(string, makeClient) {
        const hook = string.split("/").slice(5);
        let info = {
            id: hook[0],
            token: hook[1]
        };
        if (makeClient)
            return new discord_js_light_1.WebhookClient(info.id, info.token);
        return info;
    }
    async updateCovid19Info() {
        const all = (await this.client.web.get("https://disease.sh/v3/covid-19/all")).data;
        const countries = (await this.client.web.get("https://disease.sh/v3/covid-19/countries")).data;
        const data = {
            all, countries
        };
        fs_1.writeFileSync(`${__dirname}/../covid-19.json`, `${JSON.stringify(data)}`);
    }
}
exports.default = Util;
