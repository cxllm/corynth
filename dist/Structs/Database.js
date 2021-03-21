"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_light_1 = require("discord.js-light");
class Database {
    constructor(name, key, cache) {
        this.name = name;
        this.key = key;
        this.cache = cache ? new discord_js_light_1.Collection() : undefined;
    }
    ;
    init(client) {
        this.collection = client.collection(this.name);
    }
    ;
    async get(key) {
        if (this.cache) {
            let res = this.cache.get(key);
            if (!res) {
                res = await this.collection.findOne({ [this.key]: key });
                if (res) {
                    this.cache.set(res[this.key], res);
                }
            }
            return res;
        }
        else
            return await this.collection.findOne({ [this.key]: key });
    }
    async set(key, value) {
        this.cache ? this.cache.set(key, value) : null;
        let data = await this.collection.findOne({ [this.key]: key });
        if (!value[this.key])
            value[this.key] = key;
        if (!data) {
            data = await this.collection.insertOne(value);
        }
        else {
            data = await this.collection.replaceOne({ [this.key]: key }, value);
        }
    }
    async delete(key) {
        this.cache ? this.cache.delete(key) : null;
        await this.collection.findOneAndDelete({ [this.key]: key });
        return;
    }
    async uncache(key) {
        return this.cache ? this.cache.delete(key) : false;
    }
    async clearCache() {
        if (this.cache)
            this.cache.clear();
    }
}
exports.default = Database;
