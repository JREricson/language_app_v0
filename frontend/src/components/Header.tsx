import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";
import { GiBrain } from "react-icons/gi";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useAppSelector } from "../app/hooks";
import { profile_routes } from "../pages/profiles/ProfileRoutes";
import { addParamToRoute } from "../common/utils";

const Header = () => {
  const { isAuthenticated } = useAppSelector(
    (state: { auth: any }) => state.auth
  );

  return (
    <header>
      <Navbar fixed="top" bg="dark" variant="dark" expand="lg" collapseOnSelect>
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
              {!isAuthenticated && (
                <LinkContainer to="/login">
                  <Nav.Link>
                    {" "}
                    Login <FaSignInAlt />{" "}
                  </Nav.Link>
                </LinkContainer>
              )}

              {isAuthenticated && (
                <LinkContainer to="/logout">
                  <Nav.Link>
                    Logout <FaSignOutAlt />
                  </Nav.Link>
                </LinkContainer>
              )}
              {!isAuthenticated && (
                <LinkContainer to="/register">
                  <Nav.Link>Register </Nav.Link>
                </LinkContainer>
              )}
              {isAuthenticated && (
                <NavDropdown title="Profiles" id="basic-nav-dropdown">
                  <NavDropdown.Item href={profile_routes.all_profiles_pg.path}>
                    Search profiles
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href={addParamToRoute(
                      profile_routes.profile_pg.path,
                      "user"
                    )}
                  >
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item href={profile_routes.profile_edit_pg.path}>
                    Edit My Profile
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
