import React from "react";
import { Helmet } from "react-helmet";
import Socials from "../Components/Socials";
import Navbar from "../Components/Navbar";

export default class Home extends React.Component {
	render() {
		return (
			<>
				<Navbar active={window.location.pathname} />

				<div className="content text">
					<Helmet>
						<title>Corynth</title>
					</Helmet>
					<span>
						<img src="/corynth.png" width="120px" alt="Avatar" />
						<div className="intro">
							<h1>Corynth</h1>
							<p>The multi-purpose discord bot for all your server's needs</p>
							<Socials />
							<br />
							<a href="https://top.gg/bot/660818351638970370">
								<img
									alt="Top.gg Info"
									className="botlist"
									src="https://top.gg/api/widget/660818351638970370.svg"
								/>
							</a>
						</div>
					</span>
				</div>
			</>
		);
	}
}
