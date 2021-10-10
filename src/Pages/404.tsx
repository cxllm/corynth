import React from "react";
import Socials from "../Components/Socials";
export default function NotFound() {
	return (
		<div className="content anim">
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
