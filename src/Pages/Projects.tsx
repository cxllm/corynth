import React from "react";
import Socials from "../Components/Socials";
import { Helmet } from "react-helmet";
export default class Projects extends React.Component {
	render() {
		const projects = [
			{
				name: "Corynth",
				description:
					"A discord.js bot written in Typescript, based on slash commands",
				start: "December 2019",
				finish: "April 2022",
				url: "https://github.com/cxllm/corynth"
			},
			{
				name: "Currency Converter",
				description:
					"A website that allows you to convert between different currencies",
				start: "September 2021",
				finish: "Present",
				url: "https://currency.cxllm.co.uk"
			},
			{
				name: "Blog",
				description:
					"My blog/notes page where I occasionally post articles and other things",
				start: "April 2021",
				finish: "Present",
				url: "https://blog.cxllm.co.uk"
			}
		];
		return (
			<div className="content text">
				<Helmet>
					<title>Projects</title>
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
				<h1>My Projects</h1>
				<p>
					Below you can find some of my projects. To see more of my projects that
					aren't listed here, please visit my{" "}
					<a href="https://github.com/cxllm">GitHub</a>
				</p>
				<Socials />
				<div className="table">
					{projects.map((project) => {
						return (
							<div>
								<a href={project.url}>{project.name}</a>
								<p>{project.description}</p>
								<p>
									{project.start} - {project.finish}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}
