import { Collection } from "discord.js-light";
import { Collection as collection, Db } from "mongodb";

export default class Database {
  private name: string;
  private key: string;
  private cache?: Collection<string, any>;
  public collection: collection;
  constructor(name: string, key: string, cache: boolean) {
    this.name = name;
    this.key = key;
    this.cache = cache ? new Collection() : undefined;
  }

  init(client: Db) {
    this.collection = client.collection(this.name);
  }

  async get(key: string) {
    if (this.cache) {
      let res = this.cache.get(key);
      if (!res) {
        res = await this.collection.findOne({ [this.key]: key });
        if (res) {
          this.cache.set(res[this.key], res);
        }
      }
      return res;
    } else return await this.collection.findOne({ [this.key]: key });
  }
  async set(key: string, value: any) {
    this.cache ? this.cache.set(key, value) : null;
    let data = await this.collection.findOne({ [this.key]: key });
    if (!value[this.key]) value[this.key] = key;
    if (!data) {
      data = await this.collection.insertOne(value);
    } else {
      data = await this.collection.replaceOne({ [this.key]: key }, value);
    }
  }

  async delete(key: string) {
    this.cache ? this.cache.delete(key) : null;
    await this.collection.findOneAndDelete({ [this.key]: key });
    return;
  }

  async uncache(key: string) {
    return this.cache ? this.cache.delete(key) : false;
  }

  clearCache() {
    if (this.cache) this.cache.clear();
  }
}
