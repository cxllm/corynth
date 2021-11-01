import React from "react";
import Home from "./Pages/Home";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
	return (
		<Router>
			<div className="App">
				<div className="content">
					<Switch>
						<Route exact path="/" component={Home} />
						<Route exact path="*" component={Home} />
					</Switch>
				</div>
			</div>
		</Router>
	);
}

export default App;
