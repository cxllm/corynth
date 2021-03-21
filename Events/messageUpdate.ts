import Event from "../Structs/Event";
import Client from "../Structs/Client";
import Message from "../Structs/Message";
export = class extends Event {

    constructor(client: Client) {
        super(client, "messageUpdate", "on");
    }
    async run(oldMsg: Message, msg: Message) {
        if (msg.author.bot || oldMsg?.content == msg.content) return;
        this.client.events.get("message").run(msg);
    }
}