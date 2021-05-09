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
						name: "info",
						type: "SUB_COMMAND",
						description: "See info such as song name, artist, url etc."
					},
					{
						name: "lyrics",
						type: "SUB_COMMAND",
						description: "See info such as song name, artist, url etc."
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
		await msg.defer();
		let opt = msg.options[0];
		//@ts-ignore
		const song: {
			title: string;
			artist: string;
			artistNumber: number;
			start: string;
			end: string;
			//@ts-ignore
			url: string;
			image: string;
			duration: string;
			current: string;
			artistArray: string;
			left: string;
		} = this.client.Util.getSpotifyInfo(msg.member);
		if (!song) return msg.editReply("You aren't listening to Spotify!");
		const member = msg.member;
		if (opt.name == "info") {
			return await msg.editReply({
				embeds: [
					{
						title: `Spotify Info: ${member.user.tag}`,
						thumbnail: {
							url: song.image
						},
						description: `${member.user.tag} is listening to [${song.title} by ${song.artist}](${song.url})`,
						fields: [
							{
								name: "Song Info",
								value: [
									`Name: \`${song.title}\``,
									`${song.artistNumber === 1 ? "Artist" : "Artists"}: \`${
										song.artist
									}\``,
									`Duration: \`${song.duration}\``,
									`URL: [Click Here](${song.url})`
								]
							},
							{
								name: `Timestamps`,
								value: [
									`Currently at: \`${song.current}\``,
									`Time Remaining: \`${song.left}\``,
									`${song.title} started at: \`${song.start}\``,
									`${song.title} will finish at: \`${song.end}\``
								]
							}
						],
						color: this.client.config.colours.main
					}
				]
			});
		} else if (opt.name == "lyrics") {
			const s = (
				await this.client.Util.getLyrics(`${song.title} ${song.artist}`)
			)[0].result;
			if (!s)
				return await msg.editReply("Sorry, Genius couldn't find that song.");
			msg.editReply({
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
	}
};
