import React from "react";
//import Home from "./Pages/Home";
import "./App.scss";
import { BrowserRouter as Router, /*Route, Routes*/ } from "react-router-dom";
/*import Features from "./Pages/Features";
import NotFound from "./Pages/404";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TOS from "./Pages/TOS";*/

class App extends React.Component<{}> {
	render() {
		return (
			<Router>
				<div className="App">
					<div className="content">
						<h1>Corynth is no longer maintained</h1>
						<p>Thank you for your support. Corynth was a discord bot that has now shut down, as it became too consuming to keep up to date. You can find the code in a public archive here: <a href="https://github.com/cxllm/corynth">https://github.com/cxllm/corynth</a></p>
						{/*<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/features" element={<Features />} />
							<Route path="/privacy-policy" element={<PrivacyPolicy />} />
							<Route path="/tos" element={<TOS />} />
							<Route path="*" element={<NotFound />} />
						</Routes>*/}
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
