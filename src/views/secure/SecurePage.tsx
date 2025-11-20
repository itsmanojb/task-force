import { useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { ProjectContextProvider } from "@/context/ProjectContext";
import { useAppUI } from "@/context/AppUIContext";
import { DropdownContextProvider } from "@/context/DropdownContext";

import { AddBoard } from "@/components/create-new/AddBoard";
import { EditBoard } from "@/components/edit/EditBoard";
import { EditProject } from "@/components/edit/EditProject";
import { AddProject } from "@/components/create-new/AddProject";
import Header from "@/components/header/Header";

const SecurePage = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const [appUI, , uiActions] = useAppUI();

  const closeModalAndRefresh = () => {
    uiActions.closeModal();
    uiActions.triggerRefresh();
  };

  return (
    <ProjectContextProvider>
      <DropdownContextProvider>
        <Header />
      </DropdownContextProvider>
      <div className="page-content">
        <Outlet />
      </div>
      {appUI && (
        <>
          {appUI.modal === "addboard" && (
            <AddBoard
              onAdd={() => closeModalAndRefresh()}
              onClose={() => uiActions.closeModal()}
            />
          )}
          {appUI.modal === "editboard" && (
            <EditBoard
              board={appUI.modalData}
              onModify={() => closeModalAndRefresh()}
              onClose={() => uiActions.closeModal()}
            />
          )}
          {appUI.modal === "addproject" && (
            <AddProject
              onAdd={() => closeModalAndRefresh()}
              onClose={() => uiActions.closeModal()}
            />
          )}
          {appUI.modal === "editproject" && (
            <EditProject
              project={appUI.modalData}
              onModify={() => closeModalAndRefresh()}
              onClose={() => uiActions.closeModal()}
            />
          )}
        </>
      )}
    </ProjectContextProvider>
  );
};

export default SecurePage;
