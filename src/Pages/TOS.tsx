import React from "react";
import { Helmet } from "react-helmet";
import Socials from "../Components/Socials";
import Navbar from "../Components/Navbar";

class TOS extends React.Component {
	render() {
		return (
			<>
				<Navbar active={window.location.pathname} />

				<div className="content text">
					<Helmet>
						<title>Corynth | Terms of Use</title>
					</Helmet>
					<span>
						<img src="/corynth.png" width="120px" alt="Avatar" />
						<div className="intro">
							<h1>Corynth - Privacy Policy</h1>
							<p>Below you can find the Terms of Use of Corynth</p>
							<Socials />
						</div>
					</span>
					<h2>Legal</h2>
					<p>
						Corynth is not to be used maliciously with intent to break any laws (in
						any country, not just the US and UK) or the{" "}
						<a href="https://discord.com/terms">Discord Terms of Service</a>. If we
						find any cases of this not being the case, we will prohibit your use of
						the bot and if necessary report the activity to the appropriate
						authorities.
					</p>
					<h2>Availability</h2>
					<p>
						Corynth may not always be available and it may not always perform the same
						functions. Both of these are subject to change at any given moment.
					</p>
					<h2>Using Corynth</h2>
					<p>
						Corynth is free to use for everyone (certain features may come under a
						paywall in the future) and we are happy to continue to service with this
						agreement, however, if users attempt to abuse glitches or try and overload
						the systems, they are subject to being blacklisted temporarily or
						permanently from the bot. We have the right to refuse service to any
						individual who has abused our systems or has a high risk of doing so in
						the future.{" "}
					</p>
				</div>
			</>
		);
	}
}

export default TOS;
