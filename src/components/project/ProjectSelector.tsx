/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useIsMountedRef } from "@/App";

import { useAuth } from "@/context/AuthContext";
import { useAppUI } from "@/context/AppUIContext";
import { getProjects } from "@/utils/data";
import Icon from "@/components/misc/IonIcon";
import { Project } from "@/types/model";
import "./Projects.css";

const ProjectSelector = ({
  onSelection,
}: {
  onSelection: (e: Project) => void;
}) => {
  const isMountedRef = useIsMountedRef();
  const { currentUser } = useAuth();
  const [appUI, , actions] = useAppUI();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    (async function () {
      const projects = await getProjects(currentUser!.email!);
      if (isMountedRef.current) {
        setProjects(projects);
        setLoading(false);
      }
    })();
    // return () => (isMountedRef.current = false);
  }, [currentUser, isMountedRef]);

  const toggleArchive = () => {
    actions.showArchivedProject(!appUI.showArchived);
  };

  function addProjectClass(project: Project) {
    let klass = "project";
    if (project.archived) {
      klass += " archived";
    }
    if (project.pinned) {
      klass += " pinned";
    }
    return klass;
  }

  return (
    <>
      {loading && (
        <div className="inner-loading-text">Fetching projects...</div>
      )}
      <div className="project-wrapper">
        {projects.length ? (
          <div
            className={
              appUI.showArchived
                ? "recent-projects archived"
                : "recent-projects"
            }
          >
            <div className="info">
              <span className="label">All projects</span>
              <div className="project-toggle">
                <input
                  type="checkbox"
                  id="archiveToggle"
                  checked={!!appUI.showArchived}
                  onChange={toggleArchive}
                />{" "}
                <span>Show archived</span>
              </div>
            </div>
            <div className="project-list">
              {projects.map((project, i) => (
                <div
                  className={addProjectClass(project)}
                  key={i}
                  onClick={() => onSelection(project)}
                >
                  <h4>{project.name}</h4>
                  <p className="boards">{project.boards.length} Boards</p>
                </div>
              ))}
            </div>
            <div className="info">
              <span className="label">Or, create new project</span>
            </div>
            <div className="project-list">
              <div
                className="project new"
                onClick={(e) => actions.setModal("addproject", null)}
              >
                <Icon name="add" />
              </div>
            </div>
          </div>
        ) : (
          <div className="create-new">
            You have no projects created. To get started{" "}
            <span
              className="clickable"
              onClick={(e) => actions.setModal("addproject", null)}
            >
              create new project
            </span>
            .
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectSelector;
