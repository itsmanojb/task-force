import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ProjectContextProvider } from "@/context/Project";
import { ModalPageContext } from "@/context/ModalPage";
import { DropdownContextProvider } from "@/context/Dropdown";
import { Dashboard } from "@/views/secure/dashboard/Dashboard";
import { ProjectDashboard } from "@/views/secure/project/Project";
import { Board } from "@/views/secure/board/Board";

import { AddBoard } from "@/components/create-new/AddBoard";
import { EditBoard } from "@/components/edit/EditBoard";
import { EditProject } from "@/components/edit/EditProject";
import { AddProject } from "@/components/create-new/AddProject";
import Header from "@/components/header/Header";

const SecurePage = () => {
  // let { path } = useRouteMatch();
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
      <Routes>
        {/* base routes for the secure area (uses absolute paths for v6) */}
        <Route path="/s" element={<Navigate to="/s/dashboard" replace />} />
        <Route
          path="/s/dashboard"
          element={<Dashboard update={updateTime} />}
        />
        <Route
          path="/s/project/:id"
          element={<ProjectDashboard update={updateTime} />}
        />
        <Route path="/s/board/:id" element={<Board />} />
      </Routes>
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
