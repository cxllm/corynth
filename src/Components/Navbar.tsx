import { Navbar, Nav, NavDropdown } from "react-bootstrap";
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
								<img
									src="/corynth.png"
									width="30"
									height="30"
									className="d-inline-block align-top"
									alt="React Bootstrap logo"
									style={{
										borderRadius: "50px"
									}}
								/>
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
								to="/features"
								className={this.props.active === "/features" ? "active" : ""}
							>
								Features
							</Nav.Link>
							<Nav.Link
								as={Link}
								to="/privacy-policy"
								className={this.props.active === "/privacy-policy" ? "active" : ""}
							>
								Privacy Policy
							</Nav.Link>
							<Nav.Link
								as={Link}
								to="/tos"
								className={this.props.active === "/tos" ? "active" : ""}
							>
								Terms of Use
							</Nav.Link>
							<NavDropdown title="Links" id="basic-nav-dropdown">
								<NavDropdown.Item href="https://github.com/cxllm/corynth">
									Source Code
								</NavDropdown.Item>
								<NavDropdown.Item href="https://twitter.com/CorynthBot">
									Twitter
								</NavDropdown.Item>
								<NavDropdown.Item href="https://discord.com/oauth2/authorize?client_id=660818351638970370&permissions=8&scope=applications.commands%20bot">
									Invite
								</NavDropdown.Item>
								<NavDropdown.Item href="https://discord.gg/MddmTkjsmg">
									Support Server
								</NavDropdown.Item>
								<NavDropdown.Item
									href="
						https://top.gg/api/widget/660818351638970370."
								>
									Top.gg Vote Link
								</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
			</>
		);
	}
}
