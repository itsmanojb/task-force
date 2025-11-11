/* eslint-disable no-unused-vars */
import React, { useEffect, useContext, useState } from "react";
import { useIsMountedRef } from "@/App";

import { AuthContext } from "@/context/Auth";
import { ModalPageContext } from "@/context/ModalPage";
import { getProjects } from "@/utils/data";
import Icon from "@/components/misc/IonIcon";
import "./Projects.css";

const ProjectSelector = ({ update, selected }) => {
  const isMountedRef = useIsMountedRef();
  const { currentUser } = useContext(AuthContext);
  const [modalPage, setModalPage] = useContext(ModalPageContext);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [showArchived, setShowArchived] = useState(
    localStorage.getItem("showArchive")
  );

  useEffect(() => {
    (async function () {
      const projects = await getProjects(currentUser.email);
      if (isMountedRef.current) {
        setProjects(projects);
        setLoading(false);
      }
      // await getAllColumns(data.id, setColumns);
      // console.log(projects);
    })();
    return () => (isMountedRef.current = false);
  }, [currentUser, update, isMountedRef, showArchived]);

  const toggleArchive = () => {
    setShowArchived(!showArchived);
    localStorage.setItem("showArchive", !showArchived);
  };

  function addProjectClass(project) {
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
              showArchived ? "recent-projects archived" : "recent-projects"
            }>
            <div className="info">
              <span className="label">All projects</span>
              <div className="project-toggle">
                <input
                  type="checkbox"
                  id="archiveToggle"
                  checked={!!showArchived}
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
                  onClick={(e) => selected(project)}>
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
                onClick={(e) => setModalPage({ name: "addproject" })}>
                <Icon name="add" />
              </div>
            </div>
          </div>
        ) : (
          <div className="create-new">
            You have no projects created. To get started{" "}
            <span
              className="clickable"
              onClick={(e) => setModalPage({ name: "addproject" })}>
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
