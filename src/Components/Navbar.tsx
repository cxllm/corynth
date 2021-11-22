import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import React from "react";
import { Link } from "react-router-dom";
import translations from "../Translations/navbar.json";
export default class Navigation extends React.Component<{
	lang: "en" | "fr";
	setLang: () => void;
}> {
	render() {
		const translation = translations[this.props.lang];
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
					}}
					sticky="top"
				>
					<Container>
						<Navbar.Toggle aria-controls="responsive-navbar-nav" />
						<Navbar.Collapse id="responsive-navbar-nav">
							<Nav className="me-auto">
								<Nav.Link as={Link} to="/">
									{translation.home}
								</Nav.Link>
								<Nav.Link as={Link} to="/projects">
									{translation.projects}
								</Nav.Link>
							</Nav>
							<Nav>
								<NavDropdown title={translation.links} id="collapsible-nav-dropdown">
									<NavDropdown.Item href="https://github.com/cxllm">
										GitHub
									</NavDropdown.Item>
									<NavDropdown.Item href="https://twitter.com/CX11M">
										Twitter
									</NavDropdown.Item>
									<NavDropdown.Item href="https://blog.cxllm.cf">Blog</NavDropdown.Item>
								</NavDropdown>
								<Nav.Link onClick={this.props.setLang}>{translation.language}</Nav.Link>
							</Nav>
						</Navbar.Collapse>
					</Container>
				</Navbar>
			</>
		);
	}
}
