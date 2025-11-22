import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  ReactNode,
} from "react";
import { app } from "@/firebase/init";
import { Loader } from "@/common/loader/Loader";
import firebase from "firebase/app";
import "firebase/auth";

interface AuthContextType {
  currentUser: firebase.User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthProviderProps> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const unsubscribe = app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
    });

    return unsubscribe;
  }, []);

  if (pending) return <Loader />;

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthContextProvider");
  }

  return context;
}
