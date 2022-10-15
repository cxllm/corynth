import React from "react";
import Socials from "../Components/Socials";
import { Helmet } from "react-helmet";
import Navbar from "../Components/Navbar";

export default class NotFound extends React.Component {
	render() {
		return (
			<>
				<Navbar active={window.location.pathname} />
				<div className="content text">
					<Helmet>
						<title>404 - Not Found</title>
					</Helmet>
					<span>
						<img src="/corynth.png" width="120px" alt="Avatar" />
						<div className="intro">
							<h1>404 - Not Found</h1>
							<p>
								The page you were looking for ({window.location.pathname}) was not found
								<br />
								<a href="/">{"<"} Back Home</a>
							</p>

							<Socials />
						</div>
					</span>
				</div>
			</>
		);
	}
}
