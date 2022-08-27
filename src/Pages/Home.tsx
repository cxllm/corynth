import React from "react";
import { Helmet } from "react-helmet";
import Socials from "../Components/Socials";

export default class Home extends React.Component {
	render() {
		return (
			<div className="content text">
				<Helmet>
					<title>Callum | Home</title>
					<meta
						name="description"
						content="Full-Stack TypeScript and Python developer from the UK"
					/>
					<meta property="og:url" content="https://cxllm.co.uk/" />
					<meta property="og:title" content="Callum - Homepage" />
					<meta
						property="og:description"
						content="Full-Stack TypeScript and Python developer from the UK"
					/>
				</Helmet>
				<span>
					<img src="/avatar.jpg" width="120px" alt="Avatar" />
					<div className="intro">
						<h1>Callum (cxllm)</h1>
						<p>Full-Stack TypeScript and Python developer from the UK.</p>
						<Socials />
					</div>
				</span>
			</div>
		);
	}
}
