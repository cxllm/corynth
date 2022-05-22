import { Navbar, Nav } from "react-bootstrap";
import React from "react";
import { Link } from "react-router-dom";
export default class Navigation extends React.Component<{ active: string }> {
	render() {
		console.log(this.props.active);
		return (
			<>
				<Navbar
					collapseOnSelect
					expand="lg"
					variant="dark"
					style={{
						fontFamily: "Poppins",
						backgroundColor: "transparent",
						animation: "none",
						padding: "10px 20px"
					}}
					sticky="top"
				>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="me-auto" activeKey={this.props.active}>
							<Nav.Link as={Link} to="/">
								Home
							</Nav.Link>
							<Nav.Link as={Link} to="/projects">
								Projects
							</Nav.Link>
						</Nav>
						<Nav>
							<Nav.Link href="https://github.com/cxllm">GitHub</Nav.Link>
							<Nav.Link href="https://twitter.com/CX11M">Twitter</Nav.Link>
							<Nav.Link href="https://npmjs.com/~cxllm">NPM</Nav.Link>
							<Nav.Link href="https://pypi.org/user/cxllm/">PyPi</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
			</>
		);
	}
}
