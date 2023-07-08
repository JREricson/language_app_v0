import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

import { LinkContainer } from "react-router-bootstrap";


import { GiBrain } from "react-icons/gi";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";


const Header = () => {
	return (
		<header>
			<Navbar
				fixed="top"
				bg="dark"
				variant="dark"
				expand="lg"
				collapseOnSelect
			>
				<Container>
					<LinkContainer to="/">
						<Navbar.Brand>
							<GiBrain className="nav-icon" /> LanguaVersity
						</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse
						id="basic-navbar-nav"
						className="justify-content-end"
					>
						<Nav className="ml-auto">
							<LinkContainer to="/">
								<Nav.Link>Home</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/about">
								<Nav.Link>About</Nav.Link>
							</LinkContainer>

							<NavDropdown
								title="Dropdown"
								id="basic-nav-dropdown"
							>
								<NavDropdown.Item href="#action/3.1">
									Action
								</NavDropdown.Item>
								<NavDropdown.Item href="#action/3.2">
									Another action
								</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;