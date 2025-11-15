import React, { useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthContextProvider } from "./context/Auth";
import { ToastsContextProvider } from "./context/Toasts";
import { ModalPageContextProvider } from "./context/ModalPage";

import PrivateRoute from "./common/guards/PrivateRoute";

import SecurePage from "./views/secure/SecurePage";
import Home from "./views/general/home/Home";
import SignUp from "./views/general/sign-up/SignUp";
import Login from "./views/general/login/Login";
import ResetPassword from "./views/general/reset-password/ResetPassword";

import { Toast } from "./components/toast/Toast";

function App() {
  return (
    <ModalPageContextProvider>
      <ToastsContextProvider>
        <AuthContextProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/s/*"
                element={
                  <PrivateRoute>
                    <SecurePage />
                  </PrivateRoute>
                }
              />
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
