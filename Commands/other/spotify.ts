import { User, GuildMember } from "discord.js-light";
import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "spotify",
				description: "See info for your spotify presence",
				defaultPermission: true,
				options: [
					{
						name: "user",
						type: "USER",
						description: "User to get the spotify status of",
						required: false
					}
				]
			},
			{
				owner: false,
				permissions: {},
				slash: true,
				guild: true
			}
		);
		this.client = client;
	}

	async run(msg: CommandInteraction) {
		let user: User = msg.options.getUser("user", false) || msg.user;
		//@ts-ignore
		let member: GuildMember =
			user.id == msg.user.id
				? msg.member
				: msg.guild.members.cache.get(user.id) ||
				  (await msg.guild.members.fetch({ user: user.id, cache: false }));
		await msg.deferReply();
		//@ts-ignore
		const song: {
			title: string;
			artist: string;
			artistNumber: number;
			start: string;
			end: string;
			url: string;
			image: string;
			duration: string;
			current: string;
			artistArray: string;
			left: string;
			//@ts-ignore
		} = this.client.Util.getSpotifyInfo(member);
		if (!song) return msg.editReply("You aren't listening to Spotify!");
		await msg.editReply({
			embeds: [
				{
					title: `Spotify Info: ${member.user.username}`,
					thumbnail: {
						url: song.image
					},
					description: `${member.user.username} is listening to [${song.title} by ${song.artist}](${song.url})`,
					fields: [
						{
							name: "Song Info",
							value: [
								`Name: \`${song.title}\``,
								`${song.artistNumber === 1 ? "Artist" : "Artists"}: \`${song.artist}\``,
								`Duration: \`${song.duration}\``,
								`URL: [Click Here](${song.url})`
							].join("\n")
						},
						{
							name: `Timestamps`,
							value: [
								`Currently at: \`${song.current}\``,
								`Time Remaining: \`${song.left}\``,
								`Start Time: \`${song.start}\``,
								`Finish Time: \`${song.end}\``
							].join("\n")
						}
					],
					color: this.client.config.colours.main
				}
			]
		});
		const s = (
			await this.client.Util.getLyrics(`${song.title} ${song.artist}`)
		)[0].result;
		if (!s) return await msg.editReply("Sorry, Genius couldn't find that song.");
		msg.followUp({
			embeds: [
				{
					title: `Spotify Lyrics: ${song.title} by ${song.artist}`,
					description: `[Lyrics to ${song.title}](${s.url})`,
					url: s.url,
					color: this.client.config.colours.main,
					thumbnail: {
						url: song.image
					},
					footer: {
						text: "Powered by Genius Lyrics API"
					}
				}
			]
		});
	}
};
