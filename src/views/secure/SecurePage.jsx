import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  Redirect,
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
  let { path } = useRouteMatch();
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
      <Router>
        <DropdownContextProvider>
          <Header update={updateTime} />
        </DropdownContextProvider>
        <Switch>
          <Route exact path={path}>
            <Redirect to={`${path}/dashboard`} />
          </Route>
          <Route
            path={`${path}/dashboard`}
            render={(props) => <Dashboard {...props} update={updateTime} />}
          />
          <Route
            path={`${path}/project/:id`}
            render={(props) => (
              <ProjectDashboard {...props} update={updateTime} />
            )}
          />
          <Route path={`${path}/board/:id`} component={Board} />
        </Switch>
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
      </Router>
    </ProjectContextProvider>
  );
};

export default SecurePage;
