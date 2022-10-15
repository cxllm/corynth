import React from "react";
import Socials from "../Components/Socials";
import { Helmet } from "react-helmet";
import Navbar from "../Components/Navbar";

export default class Projects extends React.Component {
	render() {
		const projects = [
			{
				name: "Corynth (Discord Bot)",
				description:
					"A multi-purpose discord bot written in TypeScript using Discord.js v13. Brought back in 2022",
				start: "December 2019",
				finish: "Present",
				url: "https://corynth.cxllm.uk",
				image: "/corynth.png"
			},
			{
				name: "Currency Converter",
				description:
					"An exchange rate website that allows for conversion between multiple different currencies with up-to-date rates",
				start: "September 2021",
				finish: "Present",
				url: "https://currency.cxllm.uk",
				image: "/currency-converter.png"
			},
			{
				name: "Underground Status CLI",
				description:
					"A Python CLI that allows you to see disruptions and status updates on the TfL network.",
				start: "April 2022",
				finish: "Present",
				url: "https://github.com/cxllm/tube-cli",
				image: "/underground.png"
			},
			{
				name: "Underground Status API and Website",
				description:
					"An API written in Python and frontend writen in React providing an API-keyless way to find the status of the TfL network.",
				url: "https://tfl.cxllm.uk",
				start: "May 2022",
				finish: "Present",
				image: "/underground.png"
			},
			{
				name: "This Website",
				description:
					"This website is a project I have been working on for a while in many languages and frameworks.",
				url: "https://github.com/cxllm/website",
				start: "August 2021",
				finish: "Present",
				image: "/avatar.jpg"
			}
		];
		return (
			<>
				<Navbar active={window.location.pathname} />
				<div className="content text">
					<Helmet>
						<title>Corynth | Features</title>
					</Helmet>
					<span>
						<img src="/corynth.png" width="120px" alt="Avatar" />
						<div className="intro">
							<h1>Corynth - Features</h1>
							<p>Below are listed the features of the Corynth bot.</p>
							<Socials />
						</div>
					</span>
					<h2>Server Config</h2>
					<hr />
					<span>
						<h3>Welcome and Goodbye Messages</h3>
						<img className="botlist" src="https://i.imgur.com/LDwlNCa.png" />{" "}
						<p>
							Corynth can be configured send a message when a user joins or leaves the
							server using <code>/config edit welcome</code> or{" "}
							<code>/config edit goodbye</code>
						</p>
						<hr />
						<h3>Suggestions</h3>
						<img className="botlist" src="https://i.imgur.com/aYaYfZG.png" />{" "}
						<p>
							You can configure Corynth to setup a webhook in a specific channel so
							that users can use the <code>/suggest</code> command to send a suggestion
							into this channel for use by the server moderators <br />
							Example Command: <code>/suggest Enable:True Channel:#suggestions</code>
						</p>
					</span>
					<hr />
					<h3>Autoroles</h3>
					<p>
						You can set a role to be automatically added to a user upon their joining
						of the server with <code>/config edit autorole</code>
					</p>
					<hr />
					<h2>Server and User Information</h2>
					<p>
						Corynth can provide in-depth information about users and servers using
						various commands.
					</p>
					<span>
						<img className="botlist" src="https://i.imgur.com/NPFFKNw.png" />{" "}
						<img className="botlist" src="https://i.imgur.com/2HFDhbO.png" />{" "}
					</span>
					<br />
					<span>
						<img className="botlist" src="https://i.imgur.com/6Rc5dI1.png" />{" "}
						<img className="botlist" src="https://i.imgur.com/CqvviwX.png" />{" "}
					</span>
					<hr />
					<h2>And more!</h2>
					<p>
						There are various other commands with many different functionalities with
						lots of new ones being added all the time!
					</p>
					<hr />
				</div>
			</>
		);
	}
}
