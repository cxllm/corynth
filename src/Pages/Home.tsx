import React, { useState } from "react";
import Socials from "../Components/Socials";
export default function Home() {
	const [lastFM, setLastFM] = useState<{
		song: string;
		artist: string;
		url: string;
	} | null>(null);

	function updateLastFM() {
		fetch("https://www.cxllm.xyz/api/last-fm")
			.then((res) => res.json())
			.then((res) => {
				setLastFM(res);
			});
	}
	updateLastFM();
	setInterval(() => {
		updateLastFM();
	}, 30 * 1000);
	return (
		<div className="content anim">
			<img
				src="/avatar.jpg"
				width="100px"
				style={{ borderRadius: "50px" }}
				alt="My avatar"
			/>
			<h1>Callum</h1>
			<p>British Full-Stack, TypeScript and Python developer</p>
			<Socials />
			<a href={lastFM?.url} className="spotify">
				{lastFM ? `Listening to ${lastFM.song} by ${lastFM.artist}` : ""}
			</a>
		</div>
	);
}