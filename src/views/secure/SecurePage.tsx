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

  const [appUI, setUI, uiActions] = useAppUI();
  const [updateTime, setUpdateTime] = useState<number>();

  // useEffect(() => {
  //   setUI(appUI);
  // });

  const updatePage = (timestamp: number) => {
    // setAppUI();
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
      {appUI && (
        <>
          {appUI.modal === "addboard" && (
            <AddBoard
              onAdd={(e) => updatePage(e)}
              onClose={() => uiActions.closeModal()}
            />
          )}
          {appUI.modal === "editboard" && (
            <EditBoard
              board={appUI.modalData}
              onModify={(e) => updatePage(e)}
              onClose={() => uiActions.closeModal()}
            />
          )}
          {appUI.modal === "addproject" && (
            <AddProject
              onAdd={(e) => updatePage(e)}
              onClose={() => uiActions.closeModal()}
            />
          )}
          {appUI.modal === "editproject" && (
            <EditProject
              project={appUI.modalData}
              onModify={(e) => updatePage(e)}
              onClose={() => uiActions.closeModal()}
            />
          )}
        </>
      )}
    </ProjectContextProvider>
  );
};

export default SecurePage;
