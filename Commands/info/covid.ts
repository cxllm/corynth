import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import CommandInteraction from "../../Structs/CommandInteraction";
import moment from "moment";

export = class extends Command {
	private client: Client;

	constructor(client: Client) {
		super(
			{
				name: "coronavirus",
				description: "Get the latest coronavirus statistics.",
				defaultPermission: true,
				options: [
					{
						name: "world",
						type: "SUB_COMMAND",
						description: "Coronavirus world data"
						//required: true,
					},
					{
						name: "country",
						type: "SUB_COMMAND",
						description: "Get info of a specific country",
						options: [
							{
								name: "country",
								type: "STRING",
								description: "The country to find info on",
								required: true
							}
						]
					}
				]
			},
			{
				owner: false,
				permissions: {},
				slash: true
			}
		);
		this.client = client;
	}

	async run(msg: CommandInteraction) {
		let option = msg.options.getSubcommand();
		if (option == "world") {
			let data = this.client.Util.getCovidInfo("world");
			return await msg.reply({
				embeds: [
					{
						title: "Worldwide COVID-19 Information",
						description: `Last Updated: ${moment
							.utc(data.updated)
							.format("dddd, Do MMMM YYYY, HH:mm:ss")} (GMT)`,
						fields: [
							{
								name: "Overall",
								value: [
									`Total Cases: \`${data.cases.toLocaleString()}\``,
									`Total Deaths: \`${data.deaths.toLocaleString()}\``,
									`Total Recovered: \`${data.recovered.toLocaleString()}\``,
									`Active Cases: \`${data.active.toLocaleString()}\``
								]
							},
							{
								name: "Today",
								value: [
									`Cases Today: \`${data.todayCases.toLocaleString()}\``,
									`Deaths Today: \`${data.todayDeaths.toLocaleString()}\``,
									`Recoveries Today: \`${data.todayRecovered.toLocaleString()}\``
								]
							},
							{
								name: "Population",
								value: data.population.toLocaleString()
							}
						],
						footer: {
							text: "Information provided by the disease.sh API"
						},
						color: this.client.config.colours.main
					}
				]
			});
		} else if (option == "country") {
			//@ts-ignore
			const country: string = option.options[0].value;
			let data = this.client.Util.getCovidInfo("country", country);
			if (!data)
				return await msg.reply(
					`${this.client.config.emojis.cross} The country \`${country}\` was not found`
				);
			return await msg.reply({
				embeds: [
					{
						title: `COVID-19 Information - ${data.country}`,
						description: `Last Updated: ${moment
							.utc(data.updated)
							.format("dddd, Do MMMM YYYY, HH:mm:ss")} (UTC)`,
						fields: [
							{
								name: "Overall",
								value: [
									`Total Cases: \`${data.cases.toLocaleString()}\``,
									`Total Deaths: \`${data.deaths.toLocaleString()}\``,
									`Total Recovered: \`${data.recovered.toLocaleString()}\``,
									`Active Cases: \`${data.active.toLocaleString()}\``
								].join("\n")
							},
							{
								name: "Today",
								value: [
									`Cases Today: \`${data.todayCases.toLocaleString()}\``,
									`Deaths Today: \`${data.todayDeaths.toLocaleString()}\``,
									`Recoveries Today: \`${data.todayRecovered.toLocaleString()}\``
								].join("\n")
							},
							{
								name: "Country Info",
								value: [
									`Population: \`${data.population.toLocaleString()}\``,
									`Continent: \`${data.continent}\``
								].join("\n")
							}
						],
						footer: {
							text: `Information provided by the disease.sh API`
						},
						color: this.client.config.colours.main,
						thumbnail: {
							url: data.countryInfo.flag
						}
					}
				]
			});
		} else return msg.reply("Invalid option");
	}
};
