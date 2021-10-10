import React from "react";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Projects from "./Pages/Projects";
import NotFound from "./Pages/404";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
	return (
		<Router>
			<div className="App">
				<div className="content">
					<Navbar />
					<Switch>
						<Route exact path="/" component={Home} />
						<Route exact path="/projects" component={Projects} />
						<Route exact path="*" component={NotFound} />
					</Switch>
				</div>
			</div>
		</Router>
	);
}

export default App;
