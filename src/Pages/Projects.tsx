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
					"A multi-purpose discord bot written using Discord.JS and TypeScript that is updated to utilise slash commands",
				start: "December 2019",
				finish: "April 2022",
				url: "https://github.com/cxllm/corynth",
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
						<title>Callum | Projects</title>
						<meta
							name="description"
							content="The projects that I have been working on"
						/>
						<meta property="og:url" content="https://cxllm.co.uk/" />
						<meta property="og:title" content="Callum - Projects" />
						<meta
							property="og:description"
							content="The projects that I have been working on"
						/>
					</Helmet>
					<span>
						<img src="/avatar.jpg" width="120px" alt="Avatar" />
						<div className="intro">
							<h1>My Projects</h1>
							<p>
								Below you can find some of my projects, and you can find more listed on
								my <a href="https://github.com/cxllm">GitHub</a>
							</p>
							<Socials />
						</div>
					</span>
					<div className="table">
						{projects.map((project, i) => {
							return (
								<div className={i % 2 === 1 ? "edge" : ""}>
									<div className="image">
										<img src={project.image} alt="Avatar" />
									</div>
									<a href={project.url}>{project.name}</a>
									<p>{project.description}</p>
									<p className="time">
										{project.start} - {project.finish}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</>
		);
	}
}
