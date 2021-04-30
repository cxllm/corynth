import Client from "./Client";

export default class Event {
  client: Client;
  name: string;
  method: "on" | "once";
  constructor(client: Client, name: string, method: "on" | "once") {
    this.client = client;
    this.name = name;
    this.method = method;
  }
  async run(...args): Promise<any> {}
}
