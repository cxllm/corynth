import React from "react";
import { Helmet } from "react-helmet";
import Socials from "../Components/Socials";

export default class Home extends React.Component {
	render() {
		return (
			<div className="content text">
				<Helmet>
					<title>Callum | Experience</title>
					<meta
						name="description"
						content="Full-Stack TypeScript and Python developer from the UK"
					/>
					<meta property="og:url" content="https://cxllm.co.uk/" />
					<meta property="og:title" content="Callum - Experience" />
					<meta
						property="og:description"
						content="Full-Stack TypeScript and Python developer from the UK"
					/>
				</Helmet>
				<span>
					<img src="/avatar.jpg" width="120px" alt="Avatar" />
					<h1>Experience</h1>
					<p>
						Here is the experience I have with different languages, frameworks,
						software and operating systems.
					</p>
					<Socials />
					<div className="table">
						<div>
							<h3>Programming Languages</h3>
							<p>
								Languages: Python, JavaScript/TypeScript, HTML/CSS/SCSS
								<br />
								Python Frameworks: Flask, Jinja2, PyPi Packages <br />
								TS/JS Frameworks: Node.js, React JSX/TSX, Express.js, NPM
							</p>
						</div>
						<div>
							<h3>Operating Systems</h3>
							<p>
								Linux Distros (Desktop and Server): Fedora, openSUSE, Ubuntu, Arch
								Linux, Debian, Raspbian
								<br />
								Windows (Desktop): 10 and 11
							</p>
						</div>
						<div>
							<h3>Software</h3>
							<p>
								Desktop: VSCode, Termius, IntelliJ
								<br />
								Server: Nginx, SSH, PM2, Linux Tools <br />
								Shell: ZSH, Bash, pip, Yarn/NPM
							</p>
						</div>
					</div>
				</span>
			</div>
		);
	}
}
