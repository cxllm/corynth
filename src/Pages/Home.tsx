import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Socials from "../Components/Socials";
import translations from "../Translations/home.json";
import { Link } from "react-router-dom";

export default function Home() {
	const [lastFM, setLastFM] = useState<{
		song: string;
		artist: string;
		url: string;
		playing: boolean;
	} | null>(null);
	//@ts-ignore
	const translation = translations[localStorage.getItem("lang") || "en"];
	function updateLastFM() {
		fetch("/api/last-fm")
			.then((res) => res.json())
			.then((res) => {
				setLastFM(res);
			});
	}
	function changeLang() {
		const lang = localStorage.getItem("lang");
		localStorage.setItem("lang", lang === "fr" ? "en" : "fr");
	}
	updateLastFM();
	setInterval(() => {
		updateLastFM();
	}, 30 * 1000);
	return (
		<div className="content anim">
			<Helmet>
				<title>Callum</title>
			</Helmet>
			<h1 style={{ float: "right" }}>Callum</h1>
			<p>
				{translation["text"]} <a href="https://github.com/cxllm">GitHub</a>
			</p>
			{lastFM ? (
				<a href={lastFM?.url} className="spotify">
					<i className="fab fa-spotify"></i>
					{lastFM.playing
						? translation["listening"]
								.replace("[song]", lastFM.song)
								.replace("[artist]", lastFM.artist)
						: translation["listened"]
								.replace("[song]", lastFM.song)
								.replace("[artist]", lastFM.artist)}
				</a>
			) : (
				""
			)}
			<Socials />
			<button onClick={changeLang}>{translation.language}</button>
		</div>
	);
}
