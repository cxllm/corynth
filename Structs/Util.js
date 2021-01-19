const Client = require("./Client")
const ms = require("ms");
const { Message, GuildMember, Collection, User, WebhookClient, Webhook } = require("discord.js-light");
const moment = require("moment");
class Util {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client;
    }
    async botLists() {
        await this.client.axios.post(`https://top.gg/api/bots/${this.client.user.id}/stats`, {
            server_count: this.client.guilds.cache.size
        },
        {
            headers: {
                Authorization: this.client.config.botlists.top_gg,
                'Content-Type': 'application/json'
            }
        });
        await this.client.axios.post(`https://botsfordiscord.com/api/bot/${this.client.user.id}`, {
            server_count: this.client.guilds.cache.size
        }, {
            headers: {
                Authorization: this.client.config.botlists.bfd,
                'Content-Type': 'application/json'
            }
        }); //Bots for Discord
        await this.client.axios.post(`https://infinitybotlist.com/api/bots/${this.client.user.id}`, {
            servers: this.client.guilds.cache.size
        }, {
            headers: {
                authorization: this.client.config.botlists.infinity,
                'Content-Type': 'application/json'
            },
        }); //Infinity Bot List
        await this.client.axios.post(`https://voidbots.net/api/auth/stats/${this.client.user.id}`, {
            server_count: this.client.guilds.cache.size
        }, {
            headers: {
                Authorization: this.client.config.botlists.void,
                'Content-Type': 'application/json'
            }
        });//void bots
        this.client.logger.log("Posted stats to bot lists")
    }
    /**
     * 
     * @param {GuildMember} punished 
     * @param {GuildMember} punisher 
     */
    canPunish(punished, punisher) {
        if (punisher.roles.highest.rawPosition <= punished.roles.highest.rawPosition || punished.guild.ownerID === punished.id) return false;
        return true;
    };
    /**
     * 
     * @param {Message} param0 
     * @param {Boolean} cache 
     */
    dbLatency({ guild, author }, cache) {
        const original = Date.now();
        return cache ? (() => {
            this.client.db.Guilds.get(guild.id)
            return Date.now() - original
        })() : new Promise((resolve, reject) =>
            resolve(this.client.db.Users.get(author.id))).then(() => Date.now() - original)
    }
    /**
     * Decode something
     * @param {String} type Type to decode from
     * @param {String} text Text to decode
     */
    decode(type, text) {
        type = type.toLowerCase();
        switch (type) {
            case "binary":
                var result = "";
                var arr = text.match(/.{1,8}/g);
                for (var i = 0; i < arr.length; i++) {
                    result += String.fromCharCode(parseInt(arr[i], 2).toString(10));
                }
                return result;
            default:
                return Buffer.from(text, type).toString("utf-8")
        }
    }
    /**
     * Get a readable string from milleseconds
     * @param {Number} ms milleseconds
     */
    duration(ms) {
        const sec = Math.floor((ms / 1000) % 60).toString();
        const min = Math.floor((ms / (1000 * 60)) % 60).toString()
        const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24).toString()
        const days = Math.floor((ms / (1000 * 60 * 60 * 24))).toString()

        let string = '';
        if (days > 0) { string = `${days}d, ${hrs}h, ${min}m, ${sec}s` }
        else if (hrs > 0) { string = `${hrs}h, ${min}m, ${sec}s` }
        else if (min > 0) { string = `${min}m, ${sec}s` }
        else string = `${sec + "." + Math.ceil(ms % 1000).toString()}s`
        return string;
    }
    /**
     * Find out how long ago something was
     * @param {Number} milleseconds amount of milleseconds
     */
    durationAgo(milleseconds) {
        return ms(milleseconds, { long: true })
    }
    /**
     * Encode something
     * @param {String} type The type of encoding
     * @param {String} text Text to encode
     */
    encode(type, text) {
        type = type.toLowerCase();
        switch (type) {
            case "binary":
                let result = ""
                for (let i = 0; i < text.length; i++) {
                    let num = text[i].charCodeAt().toString(2);
                    result += Array(8 - num.length + 1).join("0") + num;
                }
                return result;
            case "hex":
            case "base64":
                return Buffer.from(text, "utf-8").toString(type)
            default:
                return;
        }
    }
    /**
     * 
     * @param {Number} bassboostgain 
     */
    eq(bassboostgain) {

        var bands = [
            { "band": 0, "gain": -0.05 },
            { "band": 1, "gain": 0 },
            { "band": 2, "gain": 0.05 },
            { "band": 3, "gain": 0.1 }
        ]

        let tmp = []

        bands.map(band => {
            if (bassboostgain === 0) band.gain = 0
            band.gain = band.gain + bassboostgain
            tmp.push(band)
        })

        return tmp

    }
    /**
     * 
     * @param {String} content The content of the sourcebin
     * @param {String} name The file name
     */
    async genSourcebin(content, name, languageId, description, title) {
        const sourcebin = require("sourcebin")
        try {
            const data = await sourcebin.create([{
                name,
                content,
                languageId
            }], {
                title: title || name,
                description
            })
            return data.short;
        } catch {
            return "An error occured generating a sourcebin paste."
        }
    }
    /**
     * 
     * @param {Collection} attachments The message attachments
     */
    getFirstAttachment(attachments) {
        let url;
        if (attachments.first()) {
            if (attachments.first().height) url = attachments.first().url;
        } else url = null;
        return url;
    }
    async getLyrics(song) {
        let encoded = encodeURIComponent(song);
        return (await this.client.axios.get(`https://api.genius.com/search?q=${encoded}`, {
            headers: {
                Authorization: `Bearer ${this.client.config.genius}`
            }
        })).data.response.hits.filter(a => a.type === 'song');
    }
    /**
     * 
     * @param {Message} ctx The message
     */
    async getMember(ctx, query, cache) {
        let members = ctx.guild.members.cache
        query = query || ctx.args.join(" ") || ctx.author.id;
        let id = this.handleMention(query)
        let out = members.get(id) ||
            members.find(member => member.user.tag.toLowerCase().includes(query.toLowerCase()) || member.displayName.toLowerCase().includes(query.toLowerCase()))
            || ctx.member;
        if ((out === ctx.member && query === ctx.author.id) || out != ctx.member) return out;
        members = await ctx.guild.members.fetch({ cache: false });
        out = members.get(id) ||
            members.find(member => member.user.tag.toLowerCase().includes(query.toLowerCase()) || member.displayName.toLowerCase().includes(query.toLowerCase())) ||
            ctx.member;
        ctx.guild.members.fetch(out.id, cache ?? true)
        return out;

    }
    async getMessageImage(ctx) {
        let url = this.getFirstAttachment(ctx.attachments) ?? (await this.getMember(ctx)).user.displayAvatarURL({ format: "png" })
        return url;
    }
    /**
    * 
    * @param {Message} msg
    * @returns {GuildMember|User}
    */
    async getPunishmentUser(msg, query) {
        let user = await this.getMember(msg, query, false);
        try {
            if (!user || user.id === msg.author.id) user = await this.client.users.fetch(query, false);
        } catch {
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
        if (!info) return false;
        const start = new Date(info.timestamps.start).getTime();
        const end = new Date(info.timestamps.end).getTime();
        let artistArray = info.state.split(";") || [info.state];
        console.log(Date.now() - new Date(start).getTime())
        let song = {
            title: info.details,
            artist: info.state.includes(";") ? info.state.split(";").join(",") : info.state,
            artistNumber: info.state.split(";").length || 1,
            start: this.utcDateShort(info.timestamps.start),
            end: this.utcDateShort(info.timestamps.end),
            url: `https://open.spotify.com/track/${info.syncID}`,
            image: `https://i.scdn.co/image/${info.assets.largeImage.split("spotify:")[1]}`,
            duration: this.timestamp(end - start),
            current: this.timestamp(Date.now() - new Date(start).getTime()),
            artistArray
        }
        return song;
    }
    /**
     * 
     * @param {String} mention The mention/id to get the id of
     */
    handleMention(mention) {
        if (mention.startsWith("<@") && mention.endsWith(">")) mention = mention.slice(2).replace(">", "")
        if (mention.startsWith("!")) mention = mention.slice(1)
        if (!mention.match(/(\d{17}|\d{18})/)) return false;
        else return mention;
    }
    memory(bytes) {
        return Math.round(bytes / 1024 / 1024 * 100) / 100
    }
    /**
     * 
     * @param {String} emoji 
     */
    resolveEmoji(emoji) {
        return emoji.replace("<", "",).replace(">", "").replace("a:", "").split(":")[2]
    }
    /**
    * Get a readable string from milleseconds
    * @param {Number} ms milleseconds
    */
    timestamp(ms) {
        const sec = Math.floor((ms / 1000) % 60)
        const min = Math.floor((ms / (1000 * 60)) % 60)
        const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24)
        const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 7)
        const weeks = Math.floor((ms / (1000 * 60 * 60 * 24 * 7)));

        return `${weeks ? `${weeks}w ` : ``}${days ? `${days}d ` : ``}${hrs ? `${hrs}h ` : ``}${min ? `${min}m ` : ``}${sec ? `${sec}s` : ``}`;
    }
    /**
     * Find out the total users of the client
     */
    totalUsers() {
        let users = 0;
        this.client.guilds.cache.map(guild => {
            if (!guild.memberCount) return;
            else users += guild.memberCount
        });
        return users;
    }
    /**
     * Get a date format
     * @param {Number} ms UNIX Timestamp
     */
    utcDate(ms) {
        return moment.utc(ms).format("HH:mm:ss, dddd Do MMMM YYYY")
    }
    utcDateShort(ms) {
        return moment.utc(ms).format("HH:mm:ss, Do MMMM YYYY")
    }
    async updateCovid19Info() {
        this.client.covid.all = (await this.client.axios.get("https://disease.sh/v3/covid-19/all")).data;
        this.client.covid.countries = (await this.client.axios.get("https://disease.sh/v3/covid-19/countries")).data;
        this.client.logger.log("Updated COVID-19 info cache")
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
        }
        if (makeClient)
            return new WebhookClient(info.id, info.token)
        return info;
    }
}
module.exports = Util