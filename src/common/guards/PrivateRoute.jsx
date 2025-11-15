import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/Auth";

const PrivateRoute = ({ children, component: RouteComponent }) => {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  if (currentUser) {
    // support both <PrivateRoute><Page/></PrivateRoute> and component prop
    if (RouteComponent) return <RouteComponent />;
    return children ? children : <Outlet />;
  }

  return <Navigate to="/login" replace state={{ from: location }} />;
};

export default PrivateRoute;
