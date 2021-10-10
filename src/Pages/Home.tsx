import React, { useState } from "react";
import { Helmet } from "react-helmet";
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
			<Helmet>
				<title>Callum - Homepage</title>
				<meta name="description" content="" />
				<meta property="og:url" content="https://cxllm.xyz/currency" />
				<meta property="og:title" content="Callum - Homepage" />
				<meta
					property="og:description"
					content="Full-Stack TypeScript and Python developer from the UK"
				/>
			</Helmet>
			<img
				src="/avatar.jpg"
				width="100px"
				style={{ borderRadius: "50px" }}
				alt="My avatar"
			/>
			<h1>Callum</h1>
			<p>Full-Stack TypeScript and Python developer from the UK</p>
			<Socials />
			<a href={lastFM?.url} className="spotify">
				{lastFM ? `Listening to ${lastFM.song} by ${lastFM.artist}` : ""}
			</a>
		</div>
	);
}
