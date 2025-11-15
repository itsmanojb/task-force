import React, { useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthContextProvider } from "@/context/Auth";
import { ConfirmProvider } from "@/context/ConfirmContext";
import { ToastsContextProvider } from "@/context/Toasts";
import { ModalPageContextProvider } from "@/context/ModalPage";

import SecurePage from "@/views/secure/SecurePage";
import Home from "@/views/general/home/Home";
import SignUp from "@/views/general/sign-up/SignUp";
import Login from "@/views/general/login/Login";
import ResetPassword from "@/views/general/reset-password/ResetPassword";
import { Dashboard } from "@/views/secure/dashboard/Dashboard";
import { ProjectDashboard } from "@/views/secure/project/Project";
import { Board } from "@/views/secure/board/Board";

import { Toast } from "@/components/toast/Toast";

function App() {
  return (
    <ConfirmProvider>
      <ModalPageContextProvider>
        <ToastsContextProvider>
          <AuthContextProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/s" element={<SecurePage />}>
                  <Route
                    index
                    element={<Navigate to="/s/dashboard" replace />}
                  />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="project/:id" element={<ProjectDashboard />} />
                  <Route path="board/:id" element={<Board />} />
                </Route>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<Home />} />
              </Routes>
              <Toast position="bottom-right" />
            </Router>
          </AuthContextProvider>
        </ToastsContextProvider>
      </ModalPageContextProvider>
    </ConfirmProvider>
  );
}

export function useIsMountedRef() {
  const isMountedRef = useRef(null);
  useEffect(() => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  });
  return isMountedRef;
}

export default App;
