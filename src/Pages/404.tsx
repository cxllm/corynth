import React from "react";
import Socials from "../Components/Socials";
import { Helmet } from "react-helmet";
import translations from "../Translations/404.json";
export default class NotFound extends React.Component<{
	lang: "en" | "fr";
}> {
	render() {
		const translation = translations[this.props.lang];
		return (
			<div className="content anim">
				<Helmet>
					<title>{translation.title}</title>
				</Helmet>
				<h1>{translation.title}</h1>
				<p>{translation.text}</p>
				<Socials />
			</div>
		);
	}
}
