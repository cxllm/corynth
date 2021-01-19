const { Collection } = require("discord.js-light")
const mongo = require("mongodb")
const { EventEmitter } = require("events")
module.exports = class Model extends Collection {
    /**
     * 
     * @param {String} name Model Name
     * @param {String} key Which value to use as the key
     * @param {Boolean} cache Whether or not to cache
     */
    constructor(name, key, cache) {
        super()
        this.cache = cache;
        this.key = key;
        this.name = name;
        this.events = new EventEmitter();
        this.cache_interval = setInterval(() => {
            super.map(data => {
                super.delete(data[this.key]);
            })
            this.events.emit("cacheSweep")
        }, 30 * 60 * 1000)
    }
    /**
     * 
     * @param {mongo.Db} client 
     */
    init(client) {
        this.collection = client.collection(this.name);
    }
    /**
     * 
     * @param {String} key The key to find
     */
    async get(key) {
        if (this.cache) {
            let res = super.get(key);
            if (!res) {
                res = await this.collection.findOne({ [this.key]: key });
                if (res) {
                    super.set(res[this.key], res)
                }
            }
            return res;
        } else return await this.collection.findOne({ [this.key]: key })
    }
    /**
     * 
     * @param {String} key The key to set
     * @param {Object} value The value to set it to
     */
    async set(key, value) {
        this.cache ? super.set(key, value) : null;
        let data = await this.collection.findOne({ [this.key]: key });
        if (!value[this.key]) value[this.key] = key;
        if (!data) {
            data = await this.collection.insertOne(value);
        } else {
            data = await this.collection.replaceOne({ [this.key]: key }, value)
        }
    }
    /**
     * 
     * @param {String} key The key to delete
     */
    async delete(key) {
        this.cache ? super.delete(key) : null;
        await this.collection.findOneAndDelete({ [this.key]: key });
        return;
    }
}