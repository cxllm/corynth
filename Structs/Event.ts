import Client from "./Client";
import { ClientEvents } from "discord.js-light";

export default class Event {
  client: Client;
  name: keyof ClientEvents;
  method: "on" | "once";

  constructor(client: Client, name: keyof ClientEvents, method: "on" | "once") {
    this.client = client;
    this.name = name;
    this.method = method;
  }

  async run(...args): Promise<any> {}
}
