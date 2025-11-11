import React, { useEffect, useState } from "react";
import { app } from "@/firebase/init";
import { Loader } from "@/common/loader/Loader";

export const AuthContext = React.createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      // console.log(user);
      setCurrentUser(user);
      setPending(false);
    });
  }, []);

  return pending ? (
    <Loader />
  ) : (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
