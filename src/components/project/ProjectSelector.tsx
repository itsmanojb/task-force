
import { useEffect, useState } from "react";
import { useIsMountedRef } from "@/App";
import { useAuth } from "@/context/AuthContext";
import { useAppUI } from "@/context/AppUIContext";
import { useConfirm } from "@/context/ConfirmContext";
import { useToasts } from "@/context/ToastsContext";
import { getProjects, deleteProjects } from "@/utils/data";
import Icon from "@/components/misc/IonIcon";
import Checkbox from "@/components/misc/Checkbox";
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
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [toasts, setToasts] = useToasts();

  const confirm = useConfirm();

  useEffect(() => {
    (async function () {
      const projects = await getProjects(currentUser!.email!);
      if (isMountedRef.current) {
        setProjects(projects);
        setLoading(false);
      }
    })();
  }, [currentUser, isMountedRef, appUI.refresh]);

  const toggleArchive = () => {
    actions.showArchivedProject(!appUI.showArchived);
  };

  function handleSelection(selected:any, project: Project) {
    if(!isSelected(project)) {
      setSelectedProjects(prev => [...prev, project.id]);
    } else {
      setSelectedProjects(prev => prev.filter(p => p !== project.id));
    }
  }

  function isSelected(project: Project) {
    return selectedProjects.includes(project.id)
  }

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

  async function confirmProjectsDeletion() {
    const ok = await confirm("Are you sure you want to permanently delete selected projects? This cannot be undone.", "Confirm!");
    if (ok) {
      await deleteProjects(selectedProjects);
      setToasts([
        ...toasts,
        {
          message: `${selectedProjects.length} project(s) has been deleted`,
          id: toasts.length,
          title: "Success",
          backgroundColor: "var(--success-green)",
          icon: "checkmark-circle",
        },
      ]);
      actions.triggerRefresh();
    }
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
            {selectedProjects.length > 0 ?
              <div className="info">
              <span className="label">
                 {selectedProjects.length + ' selected'}
              </span>
              <div className="list-actions">
                <button type="button" className="cancel" onClick={() => setSelectedProjects([])}>
                  Cancel
                </button>
                <span className="div">
                &#124;
                </span>
                <button type="button" className="delete" onClick={() => confirmProjectsDeletion()}>
                Delete
                </button>
              </div>
            </div> : <div className="info">
              <span className="label">All projects
              </span>
              <div className="list-actions">
                <Checkbox
                  id="archiveToggle"
                  label="Show archived"
                  checked={!!appUI.showArchived}
                  onChange={toggleArchive}
                />
              </div>
            </div> }
            <div className="project-list">
              {projects.map((project, i) => (
                <div
                  className={addProjectClass(project)}
                  onClick={() => onSelection(project)}
                  key={i}
                >
                  {project.archived &&
                    <div className="selection-cb">
                      <Checkbox
                      id={"project-" + i}
                      checked={isSelected(project)}
                      onChange={(e) => handleSelection(e, project)}
                      style={{
                        "--radius": '20px'
                        }}
                      />
                    </div>
                  }
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
