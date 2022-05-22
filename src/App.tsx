import React from "react";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Projects from "./Pages/Projects";
import NotFound from "./Pages/404";
import Experience from "./Pages/Experience";

class App extends React.Component<{}> {
	render() {
		return (
			<Router>
				<div className="App">
					<div className="content">
						<Navbar active={window.location.pathname} />
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/projects" element={<Projects />} />
							<Route path="/experience" element={<Experience />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
