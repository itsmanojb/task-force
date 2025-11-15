import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";

import { AuthContext } from "@/context/Auth";
import { ProjectContextProvider } from "@/context/Project";
import { ModalPageContext } from "@/context/ModalPage";
import { DropdownContextProvider } from "@/context/Dropdown";

import { AddBoard } from "@/components/create-new/AddBoard";
import { EditBoard } from "@/components/edit/EditBoard";
import { EditProject } from "@/components/edit/EditProject";
import { AddProject } from "@/components/create-new/AddProject";
import Header from "@/components/header/Header";

const SecurePage = () => {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const [modalPage, setModalPage] = useContext(ModalPageContext);
  const [updateTime, setUpdateTime] = useState(null);

  useEffect(() => {
    setModalPage(modalPage);
  });

  const updatePage = (timestamp) => {
    setModalPage(null);
    setUpdateTime(timestamp);
  };

  return (
    <ProjectContextProvider>
      <DropdownContextProvider>
        <Header update={updateTime} />
      </DropdownContextProvider>
      <div className="page-content">
        <Outlet />
      </div>
      {modalPage && (
        <>
          {modalPage.name === "addboard" && (
            <AddBoard
              added={(e) => updatePage(e)}
              closed={() => setModalPage(null)}
            />
          )}
          {modalPage.name === "editboard" && (
            <EditBoard
              board={modalPage.data}
              edited={(e) => updatePage(e)}
              closed={() => setModalPage(null)}
            />
          )}
          {modalPage.name === "addproject" && (
            <AddProject
              added={(e) => updatePage(e)}
              closed={() => setModalPage(null)}
            />
          )}
          {modalPage.name === "editproject" && (
            <EditProject
              project={modalPage.data}
              added={(e) => updatePage(e)}
              closed={() => setModalPage(null)}
            />
          )}
        </>
      )}
    </ProjectContextProvider>
  );
};

export default SecurePage;
