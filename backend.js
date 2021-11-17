const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

app.use(cors());
const axios = require("axios").default;
const config = require("./config.json");
const buildPath = path.normalize(path.join(__dirname, "./build"));
app.use(express.static(buildPath));

let lastfm = null;

async function updateLastFM() {
	try {
		const { data } = await axios.get(
			`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=cxllm&api_key=${config.lastfm}&format=json`
		);
		const song = data.recenttracks.track[0];
		if (song["@attr"] && song["@attr"].nowplaying === "true")
			lastfm = {
				song: song.name,
				artist: song.artist["#text"],
				url: song.url,
				playing: true,
			};
		else
			lastfm = {
				song: song.name,
				artist: song.artist["#text"],
				url: song.url,
				playing: false,
			};
	} catch (e) {
		console.log(e);
	}
}
updateLastFM();
setInterval(async () => {
	await updateLastFM();
}, 30 * 1000);

app.get("/api/last-fm", (_, res) => {
	return res.json(lastfm);
});

app.get("*", (_, res) => {
	return res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(process.env.PORT || 9754, () => {
	console.log("Webserver started");
});
