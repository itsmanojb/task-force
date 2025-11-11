import React, { useRef, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

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
            <Switch>
              <Route path="/" exact component={Home} />
              <PrivateRoute path="/s" component={SecurePage} />
              <Route path="/signup" component={SignUp} />
              <Route path="/login" component={Login} />
              <Route path="/reset-password" component={ResetPassword} />
              <Route exact path="*" component={Home} />
            </Switch>
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
