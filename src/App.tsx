import React from "react";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Projects from "./Pages/Projects";
import NotFound from "./Pages/404";

class App extends React.Component<{}> {
	render() {
		return (
			<Router>
				<div className="App">
					<div className="content">
						<Navbar />
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/projects" element={<Projects />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
