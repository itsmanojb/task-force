import { useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthContextProvider } from "@/context/AuthContext";
import { ConfirmProvider } from "@/context/ConfirmContext";
import { ToastsContextProvider } from "@/context/ToastsContext";
import { AppUIContextProvider } from "@/context/AppUIContext";

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
      <AppUIContextProvider>
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
      </AppUIContextProvider>
    </ConfirmProvider>
  );
}

export function useIsMountedRef() {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []); // <-- run only on mount/unmount

  return isMountedRef;
}

export default App;
