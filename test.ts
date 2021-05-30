import axios from "axios";
import cheerio from "cheerio";
async function getLastFMUser(user: string) {
  const { data } = await axios.get(`https://www.last.fm/user/${user}`);
  const $ = cheerio.load(data);
  let info: any = {};
  info.username = $(".header-title").text().trim();
  let parse = (
    toParse,
    scrobbles?
  ): [
    {
      name: string;
      artist: string;
      scrobbles: number | null;
      artist_url: string;
      song_url: string;
    }
  ] => {
    return toParse.toArray().map((a) =>
      cheerio
        .load(a)(".chartlist-row")
        .toArray()
        .map((el, i) => {
          const element = cheerio.load(el);
          return {
            name: element(".chartlist-name").text().split("\n").join("").trim(),
            artist: element(".chartlist-artist")
              .text()
              .split("\n")
              .join("")
              .trim(),
            scrobbles: scrobbles
              ? parseInt(
                  element(".chartlist-count-bar-value")
                    .text()
                    .split("\n")
                    .join("")
                    .trim()
                    .split(" scrobbles")[0]
                )
              : null,
            artist_url:
              "https://www.last.fm" +
              element(".chartlist-artist a").attr().href,
            song_url:
              "https://www.last.fm" + element(".chartlist-name a").attr().href
          };
        })
    );
  };
  info.recent = parse($("#recent-tracks-section"));
  info.top = parse($("#top-tracks"), true);
  let metadata = cheerio.load($(".header-metadata-item").toArray());
  info.scrobbles = parseInt(
    $(metadata("a").toArray()[0]).text().split(",").join("")
  );
  info.artists = parseInt(
    $(metadata("a").toArray()[1]).text().split(",").join("")
  );
  console.log(info.top, info.recent);
  return info;
}
getLastFMUser("cxllm");
