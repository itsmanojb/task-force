import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAppUI } from "@/context/AppUIContext";
import { useProject } from "@/context/ProjectContext";
import SideNav from "@/components/sidenav/Sidenav";
import RightPanel from "@/components/right-panel/RightPanel";
import ProjectSelector from "@/components/project/ProjectSelector";
import { Project } from "@/types/model";
import "./Dashboard.css";

export const Dashboard = () => {
  const [currentProject, setCurrentproject] = useProject();
  const [appUI] = useAppUI();

  useEffect(() => {
    if (currentProject) {
      document.title = `Project - ${currentProject.name} - TaskForce`;
    } else {
      document.title = "Dashboard - TaskForce";
    }
  }, [currentProject]);

  const setProject = (project: Project) => {
    localStorage.setItem("currentProject", JSON.stringify(project));
    setCurrentproject(project);
  };

  return (
    <div className="dashboard">
      <aside>
        <SideNav target="main" />
      </aside>
      <main className="all-boards">
        {!currentProject ? (
          <ProjectSelector onSelection={(e) => setProject(e)} />
        ) : (
          <Navigate to={`/s/project/${currentProject.id}`} replace />
        )}
      </main>
      <aside>{appUI.sidePanelShown && <RightPanel />}</aside>
    </div>
  );
};
