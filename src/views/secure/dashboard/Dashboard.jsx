import React, { useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";

import { ProjectContext } from "@/context/Project";

import SideNav from "@/components/sidenav/Sidenav";
import RightPanel from "@/components/right-panel/RightPanel";
import ProjectSelector from "@/components/project/ProjectSelector";
import "./Dashboard.css";

export const Dashboard = ({ update }) => {
  const [currentProject, setCurrentproject] = useContext(ProjectContext);

  useEffect(() => {
    if (currentProject) {
      document.title = `Project - ${currentProject.name} - TaskForce`;
    } else {
      document.title = "Dashboard - TaskForce";
    }
  }, [currentProject]);

  const setProject = (project) => {
    localStorage.setItem("currentProject", JSON.stringify(project));
    setCurrentproject(project);
  };

  return (
    <>
      <main className="content">
        <div className="dashboard">
          <div>
            <SideNav target="main" />
          </div>
          <div className="all-boards">
            {!currentProject ? (
              <ProjectSelector
                update={update}
                selected={(e) => setProject(e)}
              />
            ) : (
              <Navigate to={`/s/project/${currentProject.id}`} replace />
            )}
          </div>
          <div>
            <RightPanel update={update} />
          </div>
        </div>
      </main>
    </>
  );
};
