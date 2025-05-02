import { useEffect, useState } from "react";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { GiBrain } from "react-icons/gi";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useAppSelector } from "../../app/hooks";
import { addParamToRoute } from "../../common/utils/utils";
import DictionaryModal from "../../modals/dictionary/DictionaryModal";
import CmdLineModal, { CmdOption } from "../../modals/cmd_line/CmdLineModal";
import TranslateModal from "../../modals/TranslateModal";
import { profile_routes } from "../../pages/profiles/ProfileRoutes";
import { WEBSITE_NAME } from "../../common/global_app_constants";
import { cmd_line_route_options } from "../../modals/cmd_line/cmdLineRoutes";

const Header = () => {
  const { isAuthenticated } = useAppSelector(
    (state: { auth: any }) => state.auth
  );

  const [isDictModalOpen, setIsDictModalOpen] = useState<boolean>(false);
  const handleDictModalClose = () => setIsDictModalOpen(false);

  const [isTranslateModalOpen, setIsTranslateModalOpen] =
    useState<boolean>(false);
  const handleTranslateModalClose = () => setIsTranslateModalOpen(false);

  const [isCmdLineModalOpen, setIsCmdLineModalOpen] = useState<boolean>(false);
  const handleCmdLineModalClose = () => setIsCmdLineModalOpen(false);

  const closeAllModals = () => {
    setIsCmdLineModalOpen(false);
    setIsDictModalOpen(false);
    setIsTranslateModalOpen(false);
  };
  const handleCmdLineModalShow = () => {
    closeAllModals();
    setIsCmdLineModalOpen(true);
  };
  const handleTranslateModalShow = () => {
    closeAllModals();
    setIsTranslateModalOpen(true);
  };

  const handleDictModalShow = () => {
    closeAllModals();
    setIsDictModalOpen(true);
  };
  const areNonCmdLineModalsOpen = (): boolean => {
    if (isDictModalOpen || isTranslateModalOpen || isCmdLineModalOpen) {
      return true;
    } else {
      return false;
    }
  };

  let cmd_options: CmdOption[] = [
    // options for the modals
    {
      display_str: "Dictionary",
      value: "dict-modal",
      handler: handleDictModalShow,
    },
    {
      display_str: "Translate",
      value: "translate",
      handler: handleTranslateModalShow,
    },
  ];
  cmd_options = [...cmd_options, ...cmd_line_route_options];

  // TODO - separate navigation to a new module

  useEffect(() => {
    // Toggle dictionary Modal with Esc key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        const are_modals_open: boolean = areNonCmdLineModalsOpen();

        if (are_modals_open) {
          closeAllModals();
        } else {
          setIsCmdLineModalOpen(true);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCmdLineModalOpen, isDictModalOpen, isTranslateModalOpen]);

  return (
    <header>
      <Navbar fixed="top" bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <GiBrain className="nav-icon" /> {WEBSITE_NAME}
            </Navbar.Brand>
          </LinkContainer>

          <Button onClick={handleDictModalShow} variant="outline-success">
            Dictionary
          </Button>
          <Button onClick={handleTranslateModalShow} variant="outline-success">
            Translate
          </Button>
          <Button onClick={handleCmdLineModalShow} variant="outline-success">
            Command Line
          </Button>

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
      <DictionaryModal
        isOpen={isDictModalOpen}
        onClose={handleDictModalClose}
      />
      <TranslateModal
        isOpen={isTranslateModalOpen}
        onClose={handleTranslateModalClose}
      />
      <CmdLineModal
        isOpen={isCmdLineModalOpen}
        onClose={handleCmdLineModalClose}
        cmd_options={cmd_options}
      />
    </header>
  );
};

export default Header;
