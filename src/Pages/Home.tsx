import React from "react";
import { Helmet } from "react-helmet";
import Socials from "../Components/Socials";
import translations from "../Translations/home.json";

export default class Home extends React.Component<
	{
		lang: "en" | "fr";
	},
	{
		song: string;
		artist: string;
		url: string;
		playing: boolean;
	}
> {
	//@ts-ignore
	interval: NodeJS.Timer;
	constructor(props: any) {
		super(props);
		this.state = {
			song: "",
			artist: "",
			url: "",
			playing: false,
		};
	}
	updateLastFM() {
		fetch("/api/last-fm")
			.then((res) => res.json())
			.then((res) => {
				this.setState(res);
			});
	}
	componentDidMount() {
		this.updateLastFM();
		this.interval = setInterval(() => {
			this.updateLastFM();
		}, 10 * 1000);
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	render() {
		const translation = translations[this.props.lang];
		return (
			<div className="content anim">
				<Helmet>
					<title>{translation.title}</title>
				</Helmet>
				<h1 style={{ float: "right" }}>Callum</h1>
				<p>{translation["text"]}</p>
				{this.state.song ? (
					<a href={this.state.url} className="spotify">
						<i className="fab fa-spotify"></i>
						{(this.state.playing ? translation["listening"] : translation["listened"])
							.replace("[song]", this.state.song)
							.replace("[artist]", this.state.artist)}
					</a>
				) : (
					""
				)}
				<Socials />
			</div>
		);
	}
}
