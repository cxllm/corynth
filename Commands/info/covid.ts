import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import Message from "../../Structs/Message";
import moment from "moment";
export = class extends Command {
    private client: Client;
    constructor(client: Client) {
        super("covid", {
            description: "Find out the latest statistics for the coronavirus pandemic.",
            aliases: ["coronavirus", "cv", "covid19"],
            usage: "<world/country name>"
        }, {
            owner: false,
            args: 1,
            permissions: {}
        })
        this.client = client;
    }
    async run(msg: Message) {
        const arg = msg.args[0].toLowerCase();
        let data;
        let embed;
        switch (arg) {
            case "world":
                data = this.client.Util.getCovidInfo("world");
                embed = {
                    title: "Worldwide COVID-19 Information",
                    description: `Last Updated: ${moment.utc(data.updated).format("dddd, Do MMMM YYYY, HH:mm:ss")} (UTC)`,
                    fields: [
                        {
                            name: "Totals", value: [`Total Cases: \`${data.cases.toLocaleString()}\``, `Total Deaths: \`${data.deaths.toLocaleString()}\``, `Total Recovered: \`${data.recovered.toLocaleString()}\``, `Active Cases: \`${data.active.toLocaleString()}\``]
                        },
                        {
                            name: "Today's Totals", value: [`Cases Today: \`${data.todayCases.toLocaleString()}\``, `Deaths Today: \`${data.todayDeaths.toLocaleString()}\``, `Recoveries Today: \`${data.todayRecovered.toLocaleString()}\``]
                        },
                        {
                            name: "Population", value: data.population.toLocaleString()
                        }
                    ],
                    footer: {
                        text: "Information provided by the disease.sh API"
                    },
                    color: this.client.config.colours.main
                }
                await msg.send({ embed });
                break;
            default:
                data = this.client.Util.getCovidInfo("country", arg);
                if (!data) return await msg.send(`${this.client.config.emojis.cross} The country \`${msg.args[0]}\` was not found`);
                embed = {
                    title: `COVID-19 Information - ${data.country}`,
                    description: `Last Updated: ${moment.utc(data.updated).format("dddd, Do MMMM YYYY, HH:mm:ss")} (UTC)`,
                    fields: [
                        {
                            name: "Totals", value: [`Total Cases: \`${data.cases.toLocaleString()}\``, `Total Deaths: \`${data.deaths.toLocaleString()}\``, `Total Recovered: \`${data.recovered.toLocaleString()}\``, `Active Cases: \`${data.active.toLocaleString()}\``]
                        },
                        {
                            name: "Today's Totals", value: [`Cases Today: \`${data.todayCases.toLocaleString()}\``, `Deaths Today: \`${data.todayDeaths.toLocaleString()}\``, `Recoveries Today: \`${data.todayRecovered.toLocaleString()}\``]
                        },
                        {
                            name: "Country Info", value: [`Population: \`${data.population.toLocaleString()}\``, `Continent: \`${data.continent}\``]
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
                msg.send({ embed });
                break;
        }
    }
}