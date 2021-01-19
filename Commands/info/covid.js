const Command = require("../../Structs/Command");
const Client = require("../../Structs/Client");
const { Message } = require("discord.js-light");
const moment = require("moment");
module.exports = class extends Command {
    constructor() {
        super("covid", {
            help: {
                aliases: ["covid19", "coronavirus", "cv", "corona"],
                usage: "<world/country name>",
                description: "Find out latest coronavirus info in the world/your country"
            },
            config: {
                args: 1,
                permissions: {
                    user: false,
                    bot: false
                },
                owner: false,
                cooldown: false
            }
        })
    }
    /**
     * 
     * @param {Client} client 
     * @param {Message} msg 
     */
    async run(client, msg) {
        let data;
        let embed;
        let arg = msg.args[0].toLowerCase();
        switch (arg) {
            case "world":
                data = client.covid.all
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
                        text: `Information provided by the disease.sh API`
                    },
                    color: client.config.colours.main
                }
                await msg.reply({ embed })
                break;
            default:
                data = client.covid.countries.find(country => country.country.toLowerCase() === arg || country.countryInfo.iso2?.toLowerCase() === arg);
                if (!data) return await msg.reply(`${client.config.emojis.cross} That country was not found`);
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
                    color: client.config.colours.main,
                    thumbnail: {
                        url: data.countryInfo.flag
                    }
                }
                msg.reply({ embed })

        }
    }
}