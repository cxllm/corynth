import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import React from "react";
import { Link } from "react-router-dom";
export default class Navigation extends React.Component {
	render() {
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
						<Nav className="me-auto">
							<Nav.Link as={Link} to="/">
								Home
							</Nav.Link>
							<Nav.Link as={Link} to="/projects">
								Projects
							</Nav.Link>
						</Nav>
						<Nav>
							<NavDropdown title="Links" id="collapsible-nav-dropdown">
								<NavDropdown.Item href="https://github.com/cxllm">
									GitHub
								</NavDropdown.Item>
								<NavDropdown.Item href="https://twitter.com/CX11M">
									Twitter
								</NavDropdown.Item>
								<NavDropdown.Item href="https://blog.cxllm.co.uk">
									Blog
								</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
			</>
		);
	}
}
