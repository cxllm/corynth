import React from "react";
import Socials from "../Components/Socials";
import { Helmet } from "react-helmet";
export default class NotFound extends React.Component {
	render() {
		return (
			<div className="content text">
				<Helmet>
					<title>404 - Not Found</title>
				</Helmet>
				<h1>404 - Not Found</h1>
				<p>The page you were looking for ({window.location.href}) was not found</p>
				<Socials />
			</div>
		);
	}
}
