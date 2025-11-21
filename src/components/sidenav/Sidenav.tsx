/* eslint-disable jsx-a11y/anchor-is-valid, no-unused-vars */
import { useNavigate } from "react-router-dom";
import { app as firebaseApp } from "@/firebase/init";
import { getProject, updateProject, archiveProject } from "@/utils/data";
import { useConfirm } from "@/context/ConfirmContext";
import { useProject } from "@/context/ProjectContext";
import { useAppUI } from "@/context/AppUIContext";
import { useToasts } from "@/context/ToastsContext";
import Icon from "@/components/misc/IonIcon";
import "./Sidenav.css";

const SideNav = ({ target }: { target: string }) => {
  const navigate = useNavigate();
  const [currentProject, setCurrentProject] = useProject();
  const [appUI, _, actions] = useAppUI();
  const [toasts, setToasts] = useToasts();

  const confirm = useConfirm();

  async function handleLogout() {
    const ok = await confirm("Are you sure you want to log out?", "Confirm!");
    if (ok) {
      await firebaseApp.auth().signOut();
    }
  }

  async function doArchive() {
    const ok = await confirm(
      "If you archive this project, you'll not be able to create or modify any boards or tasks for this project. Are you sure?",
      "Please Note!",
    );
    if (ok) {
      const archived = await archiveProject(currentProject!.id);
      setToasts([
        ...toasts,
        {
          message: archived
            ? "Project has been archived"
            : "Failed to archive the project",
          id: toasts.length,
          title: archived ? "Success" : "Error",
          backgroundColor: archived ? "var(--success-green)" : "#d9534f",
          icon: archived ? "checkmark-circle" : "warning",
        },
      ]);
      backToAllProjects();
    }
  }

  async function markAsFavorite() {
    const updated = await updateProject(currentProject!.id, {
      pinned: !currentProject!.pinned,
    });
    if (updated) {
      const updatedDoc: any = await getProject(currentProject!.id);
      updatedDoc["id"] = currentProject!.id;
      setCurrentProject(updatedDoc);
    }
  }

  function doEdit() {
    if (currentProject?.archived) {
      setToasts([
        ...toasts,
        {
          message: "Modification on archived project is not allowed",
          id: toasts.length,
          title: "Error",
          backgroundColor: "#d9534f",
          icon: "warning",
        },
      ]);
      return;
    }
    actions.setModal("editproject", currentProject);
  }

  function backToAllProjects(): void {
    localStorage.removeItem("currentProject");
    setCurrentProject(null);
    navigate(`/s`);
  }

  return (
    <div className="sidenav">
      <ul className="sidenav-nav">
        {target === "main" && (
          <>
            <li className="nav-item disabled">
              <a className="nav-link" title="Calendar">
                <Icon name="calendar-outline" />
              </a>
            </li>
            <li className="nav-item disabled">
              <a className="nav-link" title="Statistics">
                <Icon name="analytics-outline" />
              </a>
            </li>
          </>
        )}
        {currentProject && (
          <>
            <li className="nav-item">
              <a
                className="nav-link"
                title="All Projects"
                onClick={() => backToAllProjects()}
              >
                <Icon name="layers-outline" />
              </a>
            </li>
            <li className="nav-item">
              <a
                className={
                  appUI.membersListShown ? "nav-link active" : "nav-link"
                }
                title="Members"
                onClick={() =>
                  actions.setMembersListShown(!appUI.membersListShown)
                }
              >
                <Icon name="people-outline" />
              </a>
            </li>
            <li
              className={
                currentProject.archived ? "nav-item disabled" : "nav-item"
              }
            >
              <a
                className="nav-link"
                title="Mask as Favorite"
                onClick={markAsFavorite}
              >
                <Icon name={currentProject.pinned ? "star" : "star-outline"} />
              </a>
            </li>
            <li
              className={
                currentProject.archived ? "nav-item disabled" : "nav-item"
              }
            >
              <a className="nav-link" title="Edit Project" onClick={doEdit}>
                <Icon name="create-outline" />
              </a>
            </li>
            <li
              className={
                currentProject.archived ? "nav-item disabled" : "nav-item"
              }
            >
              <a
                className="nav-link"
                title="Archive Project"
                onClick={doArchive}
              >
                <Icon name="archive-outline" />
              </a>
            </li>
          </>
        )}
        <li className="nav-item">
          <a
            className={appUI.sidePanelShown ? "nav-link active" : "nav-link"}
            title="Toggle information panel"
            onClick={() => actions.setSidePanelShown(!appUI.sidePanelShown)}
          >
            <Icon name="information-circle-outline" />
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" onClick={handleLogout} title="Log Out">
            <Icon name="power" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SideNav;
