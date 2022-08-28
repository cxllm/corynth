import { Navbar, Nav } from "react-bootstrap";
import React from "react";
import { Link } from "react-router-dom";
export default class Navigation extends React.Component<{ active: string }> {
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
								Callum
							</Navbar.Brand>
						</Nav>
						<Nav defaultActiveKey="/">
							<Nav.Link
								as={Link}
								to="/"
								className={this.props.active === "/" ? "active" : ""}
							>
								Home
							</Nav.Link>
							<Nav.Link
								as={Link}
								to="/projects"
								className={this.props.active === "/projects" ? "active" : ""}
							>
								Projects
							</Nav.Link>
							<Nav.Link
								as={Link}
								to="/experience"
								className={this.props.active === "/experience" ? "active" : ""}
							>
								Experience
							</Nav.Link>
							{/*<NavDropdown title="Links" id="basic-nav-dropdown">
								<NavDropdown.Item href="https://github.com/cxllm">
									GitHub
								</NavDropdown.Item>
								<NavDropdown.Item href="https://twitter.com/CX11M">
									Twitter
								</NavDropdown.Item>
								</NavDropdown>*/}
						</Nav>
					</Navbar.Collapse>
				</Navbar>
			</>
		);
	}
}
