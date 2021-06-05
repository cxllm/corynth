import Client from "../../Structs/Client";
import Command from "../../Structs/Command";
import moment from "moment";
import Message from "../../Structs/Message";

export = class extends Command {
  private client: Client;

  constructor(client: Client) {
    super(
      {
        name: "coronavirus",
        description: "Get the latest coronavirus statistics."
      },
      {
        owner: false,
        permissions: {},
        slash: false,
        args: 1,
        aliases: [
          "covid19",
          "covid",
          "cv",
          "covid-19",
          "coronavirus",
          "corona"
        ],
        usage: "<world/country> [country]"
      }
    );
    this.client = client;
  }

  async run(msg: Message) {
    let option = msg.args[0].toLowerCase();
    if (option === "world") {
      let data = this.client.Util.getCovidInfo("world");
      return await msg.send({
        embed: {
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
      });
    } else if (option == "country") {
      //@ts-ignore
      const country: string = msg.args[1];
      if (!country) return await msg.send("Please provide a country name");
      let data = this.client.Util.getCovidInfo("country", country);
      if (!data)
        return await msg.send(
          `${this.client.config.emojis.cross} The country \`${country}\` was not found`
        );
      return await msg.send({
        embed: {
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
              name: "Country Info",
              value: [
                `Population: \`${data.population.toLocaleString()}\``,
                `Continent: \`${data.continent}\``
              ]
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
      });
    } else return msg.send(this.client.UsageEmbed(this));
  }
};
