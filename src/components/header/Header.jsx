/* eslint-disable
jsx-a11y/anchor-is-valid,
no-unused-vars
*/

import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import { AuthContext } from "@/context/Auth";
import { ProjectContext } from "@/context/Project";
import { ModalPageContext } from "@/context/ModalPage";
import { DropdownContext } from "@/context/Dropdown";
import { getProjects, getBoards } from "@/utils/data";
import Logo from "@/assets/icons/logo.svg";
import Icon from "@/components/misc/IonIcon";
import "./Header.css";

const Navbar = (props) => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">{props.children}</ul>
    </nav>
  );
};

const NavItem = ({ children, link, icon, label, klass = "icon-button" }) => {
  const [open, setOpen] = useContext(DropdownContext);

  return link ? (
    <li className="nav-item">
      <NavLink to={link} className={klass}>
        {icon} {label}
      </NavLink>
    </li>
  ) : (
    <li className="nav-item">
      <a className={klass} onClick={() => setOpen(!open)}>
        {icon} {label}
      </a>
      {open && children}
    </li>
  );
};

const DropdownMenu = ({ items, current, setProject }) => {
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);
  const [open, setOpen] = useContext(DropdownContext);
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState(null);
  const [boards, setBoards] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight + 32);
  }, []);

  useEffect(() => {
    if (current) {
      getBoards(currentUser.email, current.id)
        .then((boards) => {
          setBoards(boards);
        })
        .catch(() => {
          setBoards([]);
        });
    }
  }, [currentUser, current]);

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height + 32);
  }

  function setCurrentProject(project) {
    setOpen(false);
    setProject(project);
    localStorage.setItem("currentProject", JSON.stringify(project));
    navigate(`/s/project/${project.id}`);
  }

  function resetProject() {
    localStorage.removeItem("currentProject");
    navigate(`/s/dashboard`);
    setProject(null);
    setOpen(false);
  }

  function setBoard(board) {
    navigate(`/s/board/${board.id}`, { boardName: board.name });
    setOpen(false);
  }

  const DropdownItem = (props) => {
    const { children, link, goToMenu, leftIcon, rightIcon, role, item } = props;
    const [modalPage, setModalPage] = useContext(ModalPageContext);

    function handleClick(e) {
      if (role === "SET_PROJECT") {
        setCurrentProject(item);
      } else if (role === "RESET_PROJECT") {
        resetProject();
      } else if (role === "CREATE_BOARD") {
        setModalPage({ name: "addboard" });
        setOpen(false);
      } else if (role === "SET_BOARD") {
        setBoard(item);
        setOpen(false);
      }
    }

    return link ? (
      <NavLink to={link} className="menu-item">
        {leftIcon && <span className="icon-button">{leftIcon}</span>}
        {children}
        <span className="icon-right">{rightIcon}</span>
      </NavLink>
    ) : (
      <a
        className="menu-item"
        onClick={(e) => (goToMenu ? setActiveMenu(goToMenu) : handleClick(e))}
      >
        {leftIcon && <span className="icon-button">{leftIcon}</span>}
        {children}
        <span className="icon-right">{rightIcon}</span>
      </a>
    );
  };

  return (
    <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === "main"}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <div className="overscroll">
            {current ? (
              <>
                <div className="overscroll">
                  <DropdownItem
                    leftIcon={<Icon name="folder-outline" />}
                    rightIcon={<Icon name="chevron-forward" />}
                    goToMenu="boards"
                  >
                    {current.name}
                  </DropdownItem>
                  <span className="divider"></span>
                  {items
                    .filter(
                      (item) => current.name !== item.name && !item.archived,
                    )
                    .map((item, i) => (
                      <DropdownItem
                        key={i}
                        leftIcon={<Icon name="folder-outline" />}
                        role={"SET_PROJECT"}
                        item={item}
                      >
                        {item.name}
                      </DropdownItem>
                    ))}
                </div>
                <span className="divider"></span>
                <DropdownItem
                  leftIcon={<Icon name="chevron-back" />}
                  role={"RESET_PROJECT"}
                >
                  Projects Home
                </DropdownItem>
              </>
            ) : (
              <>
                {items
                  .filter((item) => !item.archived)
                  .map((item, i) => (
                    <DropdownItem
                      key={i}
                      leftIcon={<Icon name="folder-outline" />}
                      role={"SET_PROJECT"}
                      item={item}
                    >
                      {item.name}
                    </DropdownItem>
                  ))}
              </>
            )}
            {/* <DropdownItem leftIcon={<Icon name="person-outline" />}>{currentUser.displayName}</DropdownItem> */}
          </div>
        </div>
      </CSSTransition>

      {current && (
        <CSSTransition
          in={activeMenu === "boards"}
          timeout={500}
          classNames="menu-secondary"
          unmountOnExit
          onEnter={calcHeight}
        >
          <div className="menu">
            <DropdownItem
              goToMenu="main"
              leftIcon={<Icon name="chevron-back" />}
            >
              Back to {current.name}
            </DropdownItem>
            <span className="divider"></span>
            {boards.map((board, i) => (
              <DropdownItem
                key={i}
                leftIcon={<Icon name="clipboard-outline" />}
                role={"SET_BOARD"}
                item={board}
              >
                {board.name}
              </DropdownItem>
            ))}
            <DropdownItem leftIcon={<Icon name="add" />} role={"CREATE_BOARD"}>
              Create new board
            </DropdownItem>
          </div>
        </CSSTransition>
      )}

      {/* <CSSTransition
        in={activeMenu === 'settings'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<Icon name="chevron-back" />}>
            <h2>Settings</h2>
          </DropdownItem>
          <DropdownItem leftIcon={<Icon name="shield-checkmark-outline" />} link='/'>Change Password</DropdownItem>
        </div>
      </CSSTransition> */}
    </div>
  );
};

const Header = ({ update }) => {
  const { currentUser } = useContext(AuthContext);
  const [currentProject, setCurrentProject] = useContext(ProjectContext);
  const [modalPage, setModalPage] = useContext(ModalPageContext);
  const [currentPage, setCurrentPage] = useState("Select Project");
  const [currentBoard, setCurrentBoard] = useState("");
  const [projects, setProjects] = useState([]);
  const location = useLocation();

  useEffect(() => {
    (async function () {
      const projects = await getProjects(currentUser.email);
      setProjects(projects);
      // await getAllColumns(data.id, setColumns);
    })();
  }, [currentUser, update]);

  useEffect(() => {
    if (currentProject) {
      const projectName = currentProject.name;
      setCurrentPage(projectName);
    } else {
      setCurrentPage("Select Project");
    }
  }, [currentProject]);

  useEffect(() => {
    if (location.pathname.startsWith("/s/board/")) {
      setCurrentBoard(location.state.boardName);
    } else {
      setCurrentBoard("");
    }
  }, [location]);

  return (
    <header className="app-header">
      <NavLink to="/s" className="brand">
        <img src={Logo} alt="logo" />
      </NavLink>
      <div className="nav-actions">
        <Navbar>
          <NavItem
            label={currentPage}
            icon={<Icon name="folder-open-outline" />}
            klass="text-button"
          >
            <DropdownMenu
              items={projects}
              current={currentProject}
              setProject={setCurrentProject}
            />
          </NavItem>
          {currentBoard && (
            <NavItem label={currentBoard} klass="text-button inactive" />
          )}
        </Navbar>
      </div>
      <div className="cta">
        <button
          disabled={
            !currentProject ||
            currentProject.archived ||
            modalPage === "addboard"
          }
          onClick={(e) => setModalPage({ name: "addboard" })}
          className="cta-btn"
        >
          {" "}
          Create New Board{" "}
        </button>
      </div>
      {/* <div className="search">
        <Navbar>
          <NavItem link="/s/dashboard" icon={<Icon name="search" />} />
        </Navbar>
      </div> */}
    </header>
  );
};

export default Header;
