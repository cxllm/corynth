import React from "react";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Projects from "./Pages/Projects";
import NotFound from "./Pages/404";

class App extends React.Component<{}> {
	lang: "en" | "fr" = "en";
	changeLang() {
		const lang = localStorage.getItem("lang");
		localStorage.setItem("lang", lang === "fr" ? "en" : "fr");
		//@ts-ignore
		this.lang = localStorage.getItem("lang") || "en";
		this.forceUpdate();
	}
	render() {
		console.log("a");
		return (
			<Router>
				<div className="App">
					<div className="content">
						<Navbar setLang={() => this.changeLang()} lang={this.lang} />
						<Routes>
							<Route path="/" element={<Home lang={this.lang} />} />
							<Route path="/projects" element={<Projects lang={this.lang} />} />
							<Route path="*" element={<NotFound lang={this.lang} />} />
						</Routes>
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
