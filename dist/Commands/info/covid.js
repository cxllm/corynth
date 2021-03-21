"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Command_1 = __importDefault(require("../../Structs/Command"));
const moment_1 = __importDefault(require("moment"));
module.exports = class extends Command_1.default {
    constructor(client) {
        super("covid", {
            description: "Find out the latest statistics for the coronavirus pandemic.",
            aliases: ["coronavirus", "cv", "covid19"],
            usage: "<world/country name>"
        }, {
            owner: false,
            args: 1,
            permissions: {}
        });
        this.client = client;
    }
    async run(msg) {
        const arg = msg.args[0].toLowerCase();
        let data;
        let embed;
        switch (arg) {
            case "world":
                data = this.client.Util.getCovidInfo("world");
                embed = {
                    title: "Worldwide COVID-19 Information",
                    description: `Last Updated: ${moment_1.default.utc(data.updated).format("dddd, Do MMMM YYYY, HH:mm:ss")} (UTC)`,
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
                    color: this.client.config.colours.main
                };
                await msg.send({ embed });
                break;
            default:
                data = this.client.Util.getCovidInfo("country", arg);
                if (!data)
                    return await msg.send(`${this.client.config.emojis.cross} The country \`${msg.args[0]}\` was not found`);
                embed = {
                    title: `COVID-19 Information - ${data.country}`,
                    description: `Last Updated: ${moment_1.default.utc(data.updated).format("dddd, Do MMMM YYYY, HH:mm:ss")} (UTC)`,
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
                };
                msg.send({ embed });
                break;
        }
    }
};
