/* eslint-disable
jsx-a11y/anchor-is-valid, no-unused-vars */

import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";
import { useAppUI } from "@/context/AppUIContext";
import { getProjects } from "@/utils/data";
import { Project } from "@/types/model";
import Logo from "@/assets/icons/logo.svg";
import Icon from "@/components/misc/IonIcon";
import "./Header.css";
import { DropdownMenu } from "./DropdownMenu";
import { Navbar, NavItem } from "./Navbar";

const Header = () => {
  const { currentUser } = useAuth();
  const [currentProject, setCurrentProject] = useProject();
  const [appUI, _, actions] = useAppUI();
  const [currentPage, setCurrentPage] = useState("Select Project");
  const [currentBoard, setCurrentBoard] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const location = useLocation();

  useEffect(() => {
    (async function () {
      const projects = await getProjects(currentUser!.email!);
      setProjects(projects);
      // await getAllColumns(data.id, setColumns);
    })();
  }, [currentUser]);

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
            appUI.modal === "addboard"
          }
          onClick={(e) => actions.setModal("addboard")}
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
