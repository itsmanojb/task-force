/* eslint-disable jsx-a11y/anchor-is-valid,
no-unused-vars */
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { app as firebaseApp } from "@/firebase/init";
import { getProject, updateProject, archiveProject } from "@/utils/data";
// import confirmService from "@/components/confirm/ConfirmService";
import { createConfirm } from "@/components/confirm/ConfirmPortal";
import { ProjectContext } from "@/context/Project";
import { ModalPageContext } from "@/context/ModalPage";
import { ToastsContext } from "@/context/Toasts";
import Icon from "@/components/misc/IonIcon";
import "./Sidenav.css";

const SideNav = ({ target, extended, setExtended, navigate }) => {
  const navigateTo = useNavigate();
  const [currentProject, setCurrentProject] = useContext(ProjectContext);
  const [modalPage, setModalPage] = useContext(ModalPageContext);
  const [toasts, setToasts] = useContext(ToastsContext);

  const confirm = createConfirm();

  async function handleLogout() {
    // const result = await confirmService.show(
    //   "Are you sure you want to log out?",
    //   "Confirm!"
    // );
    const result = await confirm(
      "Are you sure you want to log out?",
      "Confirm!",
    );
    if (result) {
      await firebaseApp.auth().signOut();
    }
  }

  async function doArchive() {
    // const result = await confirmService.show(
    //   "If you archive this project, you'll not be able to create or modify any boards or tasks for this project. Are you sure?",
    //   "Please Note!",
    // );
    const result = await confirm(
      "If you archive this project, you'll not be able to create or modify any boards or tasks for this project. Are you sure?",
      "Please Note!",
    );
    if (result) {
      const archived = await archiveProject(currentProject.id);
      setToasts([
        ...toasts,
        {
          message: archived
            ? "Project has been archived"
            : "Failed to archive the project",
          id: toasts.length,
          title: archived ? "Success" : "Error",
          backgroundColor: archived ? "#47bf50" : "#d9534f",
          icon: archived ? "checkmark-circle" : "warning",
        },
      ]);
      localStorage.removeItem("currentProject");
      setCurrentProject(null);
      navigateTo(`/s`);
    }
  }

  async function markAsFavorite() {
    const updated = await updateProject(currentProject.id, {
      pinned: !currentProject.pinned,
    });
    if (updated) {
      const updatedDoc = await getProject(currentProject.id);
      updatedDoc["id"] = currentProject.id;
      setCurrentProject(updatedDoc);
    }
  }

  function doEdit() {
    if (currentProject.archived) {
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
    setModalPage({ name: "editproject", data: currentProject });
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
                onClick={(e) => navigate("dash")}
              >
                <Icon name="layers-outline" />
              </a>
            </li>
            <li className="nav-item">
              <a
                className={extended ? "nav-link active" : "nav-link"}
                title="Members"
                onClick={(e) => setExtended(!extended)}
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
          <a className="nav-link" onClick={handleLogout} title="Log Out">
            <Icon name="power" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SideNav;
