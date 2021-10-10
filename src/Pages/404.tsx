import React from "react";
import Socials from "../Components/Socials";
import { Helmet } from "react-helmet";
export default function NotFound() {
	return (
		<div className="content anim">
			<Helmet>
				<title>Callum - Not Found</title>
				<meta name="description" content="" />
				<meta property="og:url" content="https://cxllm.xyz/" />
				<meta property="og:title" content="Callum - Not Found" />
				<meta
					property="og:description"
					content="Requested page was not found on the server"
				/>
			</Helmet>
			<img
				src="/avatar.jpg"
				width="100px"
				style={{ borderRadius: "50px" }}
				alt="My avatar"
			/>
			<h1>Callum</h1>
			<p>The page requested ({window.location.pathname}) was not found</p>
			<Socials />
		</div>
	);
}
