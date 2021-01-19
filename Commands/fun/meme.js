const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
module.exports = class extends Command {
    constructor() {
        super("meme", {
            help: {
                aliases: [],
                usage: "",
                description: "Get a meme from reddit"
            },
            config: {
                args: 0,
                permissions: {
                    user: false,
                    bot: false
                },
                owner: false,
                cooldown: "5s"
            }
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        const { data } = await client.axios.get("https://api.ksoft.si/images/random-meme", {
            headers: {
                Authorization: `Bearer ${client.config.ksoft}`
            }
        });
        let embed = {
            title: data.title,
            image: {
                url: data.image_url,

            },
            url: data.source,
            color: client.config.colours.main,
            description: `Subreddit: \`${data.subreddit}\`\n${data.upvotes} 👍 | ${data.downvotes} 👎\nAuthor: \`${data.author}\``,
            footer: {
                text: `Powered by ksoft.si`
            }
        }
        await msg.reply({ embed })

    }
}