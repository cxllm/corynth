import { Navbar, Nav, NavDropdown } from "react-bootstrap";
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
				>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="me-auto">
							<Navbar.Brand
								as={Link}
								to="/"
								style={{
									fontSize: "35"
								}}
							>
								<img
									src="/avatar.jpg"
									width="35"
									height="35"
									style={{
										borderRadius: "50px"
									}}
									className="d-inline-block align-top"
									alt=""
								/>
							</Navbar.Brand>
						</Nav>
						<Nav>
							<Nav.Link as={Link} to="/">
								Home
							</Nav.Link>
							<Nav.Link as={Link} to="/projects">
								Projects
							</Nav.Link>
							<Nav.Link as={Link} to="/experience">
								Experience
							</Nav.Link>
							<NavDropdown title="Links" id="basic-nav-dropdown">
								<NavDropdown.Item href="https://github.com/cxllm">
									GitHub
								</NavDropdown.Item>
								<NavDropdown.Item href="https://twitter.com/CX11M">
									Twitter
								</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
			</>
		);
	}
}
