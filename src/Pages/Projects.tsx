import React from "react";
import Socials from "../Components/Socials";
import { Helmet } from "react-helmet";
export default function Projects() {
	const projects = [
		{
			name: "Corynth",
			description:
				"A discord.js bot written in Typescript, based on slash commands",
			start: "December 2019",
			finish: "June 2021",
			url: "https://github.com/cxllm/corynth",
		},
		{
			name: "Currency Converter",
			description:
				"A website that allows you to convert between different currencies",
			start: "September 2021",
			finish: "Present",
			url: "/currency",
		},
		{
			name: "Blog",
			description:
				"My blog/notes page where I occasionally post articles and other things",
			start: "April 2021",
			finish: "Present",
			url: "https://blog.cxllm.xyz",
		},
	];
	return (
		<div className="content anim">
			<Helmet>
				<title>Callum - Projects</title>
				<meta
					name="description"
					content="Find the projects I am working or have worked on "
				/>
				<meta property="og:url" content="https://cxllm.xyz/currency" />
				<meta property="og:title" content="Callum - Projects" />
				<meta
					property="og:description"
					content="Find the projects I am working or have worked on "
				/>
			</Helmet>
			<img
				src="/avatar.jpg"
				width="100px"
				style={{ borderRadius: "50px" }}
				alt="My avatar"
			/>

			<h1>Callum</h1>
			<p>
				Below you can find some of my projects that I am working or have worked on
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
