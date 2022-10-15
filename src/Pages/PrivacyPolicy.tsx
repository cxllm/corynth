import React from "react";
import { Helmet } from "react-helmet";
import Socials from "../Components/Socials";
import Navbar from "../Components/Navbar";

class PrivacyPolicy extends React.Component {
	render() {
		return (
			<>
				<Navbar active={window.location.pathname} />

				<div className="content text">
					<Helmet>
						<title>Corynth | Privacy Policy</title>
					</Helmet>
					<span>
						<img src="/corynth.png" width="120px" alt="Avatar" />
						<div className="intro">
							<h1>Corynth - Privacy Policy</h1>
							<p>
								Below you can find information about the data stored and how to request
								its removal
							</p>
							<Socials />
						</div>
					</span>
					<h3>What is stored?</h3>
					<h4>Servers</h4>
					<p>
						The information stored about servers is limited to the server's ID and the
						settings configured in the bot by the admin of the server, such as
						autoroles, welcome messages, etc. When Corynth is removed from a server,
						all of the data stored is wiped. No personal information is stored.
					</p>
					<h4>Users</h4>
					<p>
						There is no personally identifying information stored about users. No
						usernames, first, middle or last names are stored. The only information
						relating to a user stored is the user's ID, which cannot be used to
						identify them in the case of a data leak. The bot only uses the ID to
						process any commands on cooldown for the specific user.
					</p>
					<h3>How to have your data removed</h3>
					<p>
						If for any reason you wish to have your data removed, please join our
						support server and specify whether you would like a server's or user's
						data removed. Alternatively, if you remove the bot from the server, all
						the info will be wiped automatically.
					</p>
				</div>
			</>
		);
	}
}

export default PrivacyPolicy;
