import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("meme", {
            description: "View a meme from reddit.",
            aliases: [],
            usage: ""
        }, {
            owner: false,
            args: 0,
            permissions: {}
        })
        this.client = client;
    }
    async run(msg: Message) {
        const { data } = await this.client.web.get("https://api.ksoft.si/images/random-meme", {
            headers: {
                Authorization: `Bearer ${this.client.config.ksoft}`
            }
        });
        let embed = {
            title: data.title,
            image: {
                url: data.image_url,
            },
            url: data.source,
            color: this.client.config.colours.main,
            description: `Subreddit: \`${data.subreddit}\`\n${data.upvotes} 👍 | ${data.downvotes} 👎\nAuthor: \`${data.author}\``,
            footer: {
                text: `Powered by ksoft.si`
            }
        }
        await msg.send({ embed })
    }
}